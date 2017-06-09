/**
 * Globals
 */

var PIXI = require('pixi.js');
var app;
var canvas;

/** 
 * Generic random number integer
 *
 * @param Int min int
 * @param Int max int
 *
 * @return int
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * Inititalises the PIXI canvas and configures it.
 *
 * @param String element id to attach canvas to
 * @param Int width of canvas
 * @param Int height of canvas
 * @param JSON Extra options
 *
 * @return array
 */

function setUpEnvironment(element="body", width=800, height=600, options){
    app = new PIXI.Application({width: width, height:height});
    elem = document.getElementById(element);
    canvas = elem.appendChild(app.view);
}

/** 
 * The board object which is manages the squares objects
 *
 */

function board(){
    
    /** 
     * Holds references to all of the squares on the board
     */
    
    this.squares = [];

    /**
     * The PIXI graphics object holder
     */

    this.graphics = null;

    /**
     * Boots the repeating ticker which sets the timer for
     * the nest tick in the heartbeat
     */

    this.run = function(){
        var _this = this;
        this.timerId = setTimeout(function(){ _this.tick(); }, 250);
    }

    /**
     * Callback function for handling each tick 
     */

    this.tick = function(){
        this.calculateGrid();
        this.redrawGrid();
        this.run();
    }

    /**
     * Looks at the canvas size and builds the squares matrix
     */

    this.buildGrid = function(){
        
        this.graphics = new PIXI.Graphics();

        var draw = true;
        var col = 0;
        var row = 0;

        while(draw){
            var sq = new square();
            sq.add(col, row);
            this.squares.push(sq);
            
            if(sq.left > canvas.width){
                row++;
                col = 0;

                if(sq.top > canvas.height){
                    draw = false;
                } 
            } 
            else {
                col++;
            }            
        }
    }

    /**
     * Which squares should we initially make live on the grid?
     */

    this.populate = function(){
        var _this = this;
        
        this.squares.forEach(function(val, index){
            var no = getRandomInt(0,5);
            if(val.x > 15 && val.x < 30 && val.y > 10 && val.y < 20 && no ==  1){
                val.birth();
            }
        });        
    }

    /**
     * Loops through this.squares[] and calculates wether that square should
     * live, die or be born
     */

    this.calculateGrid = function(){

        var _this = this;
        var toBeBorn = [];
        var toBeKilled = [];

        this.squares.forEach(function(val, index){

            var total = _this.getSquaresAroundMatrix(val.x, val.y);

            if(val.alive == true){
                if(total < 2 || total > 3){ toBeKilled.push(val); }
            } else {
                if(total === 3){ toBeBorn.push(val); }
            }
        });
        
        toBeBorn.forEach(function(val, index){
            val.birth();
        });

        toBeKilled.forEach(function(val, index){
            val.death();
        });
    
    }

    /**
     * Counts how many live squares there are in the 8 squares
     * around any one particular square
     *
     * @param Int x
     * @param Int y
     *
     * @return Int
     */

    this.getSquaresAroundMatrix = function(x, y){

        var _this = this;

        var far_left = x - 1;   // 19
        var far_right = x + 1;  // 21
        var far_top = y - 1;    // 19
        var far_bottom = y + 1; // 21

        var results = 0;

        this.squares.forEach(function(val, index){

            if(val.x == x && val.y == y) return;
            if(val.x < far_left) return;
            if(val.x > far_right) return;
            if(val.y < far_top) return;
            if(val.y > far_bottom) return;

            if(val.alive == true){
                results++;
            }
        });

        return results;
    }

    /**
     * Loops thorugh this.squares[] and renders teh canvas according
     * to the x,y,alive attributes of each square object
     *
     * @return Bool
     */

    this.redrawGrid = function(){

        var _this = this;
        this.graphics.clear();        

        this.squares.forEach(function(val, index){
            if(val.alive == true){
                _this.graphics.beginFill(0xFF3333); // Purple
                _this.graphics.drawRect(val.left, val.top, val.left+20, val.top+20);
                _this.graphics.endFill();

            } else {
                _this.graphics.beginFill(0x000000); // Purple
                _this.graphics.drawRect(val.left, val.top, val.left+20, val.top+20);
                _this.graphics.endFill();
            }
        });

        return app.stage.addChild(this.graphics);

    }

    /**
     * Gets a individual square object from the board using
     * the squares given matrix position in square spaces (not pixels)
     *
     * @param Int x
     * @param Int y
     *
     * @return square
     */

    this.getByMatrix = function(x,y){
        var foundIndex = false;

        this.squares.forEach(function(val, index){
            if(val.x == x && val.y == y ){
                foundIndex = val;
            }
        });
        return foundIndex;
    }

    /**
     * Makes an individual square on the board alive using
     * its given x,y square position (not pixes position)
     *
     * @param Int x
     * @param Int y
     *
     * @return square
     */

    this.activate = function(x,y){
        var square = this.getByMatrix(x,y);
        square.birth();
    }
}

/** 
 * Individual square objects which make the whole grid.
 * 
 */

function square(){

    /**
     * Indicates if square is alive or dead
     * @var bool
     */

    this.alive = false;

    /**
     * Indicates which x square (in squares, not pixels)
     * @var int
     */

    this.x = null;

    /**
     * Indicates which y square (in squares, not pixels)
     * @var int
     */

    this.y = null;

    /**
     * Indicates how far from left in pixels (x)
     * @var int
     */

    this.left = null;

    /**
     * Indicates how far from top in pixels (x)
     * @var int
     */

    this.top = null;

    /**
     * Defined size of grid squares
     */

    const square_size = 20;

    /**
     * Inititalises and configures a square
     * @var bool
     */

    this.add = function(x,y){
        this.x = x;
        this.y = y;
        this.left = x * square_size;
        this.top = y * square_size;
        this.death();
    }

    /**
     * Makes square alive
     *
     * @return bool
     */

    this.birth = function(){
        return this.alive = true;
    }

    /**
     * Makes square dead
     *
     * @return bool
     */

    this.death = function(){
        return this.alive = false;
    }

}

/** 
 * Exported modules
 */

module.exports = {

    /**
     * Holds the board object
     */

    board : null,

    /**
     * Boot the project
     */
     
    init : function(element, width, height, options){

        setUpEnvironment(element, width, height, options);

        this.board = new board();
        this.board.buildGrid();
        this.board.populate();
        this.board.redrawGrid();
        this.board.run();
    }
    
}