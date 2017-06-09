var PIXI = require('pixi.js');
var app = new PIXI.Application();
var canvas = document.body.appendChild(app.view);
canvas.style.width = "100%";
canvas.style.height = "100%";
/** 
 * The board which manages the squares
 * 
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function board(){

    this.squares = [];

    this.graphics = null;

    this.run = function(){
        var _this = this;

        this.timerId = setTimeout(function(){
            _this.tick();
        }, 250);
    }

    this.tick = function(){
        this.calculateGrid();
        this.redrawGrid();
        this.run();
        
    }

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

    this.populate = function(){
        var _this = this;
        
        this.squares.forEach(function(val, index){
            var no = getRandomInt(0,5);
            if(val.x > 15 && val.x < 30 && val.y > 10 && val.y < 20 && no ==  1){
                val.birth();
            }
        });
        
        /*
        this.activate(20,20);
        this.activate(21,21);
        this.activate(19,22);
        this.activate(20,22);
        this.activate(21,22);
        */
        
    }

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

        app.stage.addChild(this.graphics);

    }

    this.getByMatrix = function(x,y){
        
        var foundIndex = false;

        this.squares.forEach(function(val, index){
            if(val.x == x && val.y == y ){
                foundIndex = val;
            }
        });
        return foundIndex;
    }

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

    this.alive = false;
    this.x = null;
    this.y = null;
    this.left = null;
    this.top = null;

    const square_size = 20;

    this.add = function(x,y){
        this.x = x;
        this.y = y;
        this.left = x * square_size;
        this.top = y * square_size;
        this.death();
    }

    this.birth = function(){
        this.alive = true;
    }

    this.death = function(){
        this.alive = false;
    }

}

module.exports = {

    board : null,

    init : function(){
        this.board = new board();
        this.board.buildGrid();
        this.board.populate();
        this.board.redrawGrid();
        this.board.run();
    },
    
}