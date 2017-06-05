var PIXI = require('pixi.js');
var app = new PIXI.Application();
var canvas = document.body.appendChild(app.view);

/** 
 * The board which manages the squares
 * 
 */
function board(){

    this.squares = [];

    this.run = function(){
        var _this = this;
         this.timerId = setTimeout(function(){
            _this.tick();
        }, 100);
    }

    this.tick = function(){
        this.redrawGrid();
        this.run();
    }

    this.buildGrid = function(){
        
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

    this.redrawGrid = function(){

        console.log("Redraw");
    }

    this.getByMatrix = function(x,y){
        var foundIndex;
        this.squares.forEach(function(val, index){
            if(val.x == x && val.y == y){
                foundIndex = val;
            }
        });
        return foundIndex;
    }

    this.activate = function(x,y){
        var square = this.getByMatrix(x,y);
        square.on();
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

    var graphic;
    const square_size = 20;

    this.add = function(x,y){
        this.x = x;
        this.y = y;
        this.left = x * square_size;
        this.top = y * square_size;
        this.off();
    }

    this.on = function(){
        app.stage.removeChild(graphic);
        graphic = this.makeGraphic(0xFF88FF);
        app.stage.addChild(graphic);
        this.alive = true;
    }

    this.off = function(){
        app.stage.removeChild(graphic);
        graphic = this.makeGraphic(0x222222);
        app.stage.addChild(graphic);
        this.alive = false;
    }

    this.makeGraphic = function(colour){
        graphic = new PIXI.Graphics();
        graphic.beginFill(colour, 0.8);
        graphic.drawRect(this.left, this.top, square_size, square_size);
        graphic.endFill();
        return graphic;
    }
}

module.exports = {

    board : null,
    init : function(){
        this.board = new board();
        
        this.board.buildGrid();

        this.board.activate(2,2);
        this.board.activate(3,2);
        this.board.activate(2,3);
     
        this.board.run();
    },
    
}