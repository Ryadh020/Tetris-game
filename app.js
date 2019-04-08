const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// VAR's : /////////////////////////////

const COLUMNS = 14;
const ROWS = 23;
const SQ = 20;
const white = "gray";

let board =[];


// I. BUILD the GAME BOARD : //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // CREATE PART ////////////////////////////////////////////
    for (let i =0; i<ROWS; i++) {
            board[i] = [];
        for(let j=0; j<COLUMNS; j++) {
            board[i][j] = white;
        }
    }

        // DRAW PART //////////////////////////////////////////////
    function drawBoard(){
     for (let i =0; i<ROWS; i++) {
        for(let j=0; j<COLUMNS; j++) {
            drawBox(j,i,board[i][j]);
            }
        }
    }
    drawBoard();

// II. BUILD the BOX :  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawBox(x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// III. BUILD the teterminoes :  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // CREATE PART ////////////////////////////////////////////

const z = [
        // Z //
[   [1,1,0],
    [0,1,1],
    [0,0,0] ],

[   [0,0,1],
    [0,1,1],
    [0,1,0] ],

[   [0,0,0],
    [1,1,0],
    [0,1,1] ],
    
[   [1,0,0],
    [1,1,0],
    [0,1,0] ],

]

const l = [
    // L //
[   [1,0,0],
    [1,0,0],
    [1,1,1] ],

[   [0,0,1],
    [0,0,1],
    [1,1,1] ],

[   [1,1,1],
    [0,0,1],
    [0,0,1] ],

[   [1,1,1],
    [1,0,0],
    [1,0,0] ],

]

const i = [
    // L //
[   [0,1,0],
    [0,1,0],
    [0,1,0] ],

[   [0,0,0],
    [1,1,1],
    [0,0,0] ]

]

const s = [
    // L //
[   [0,1,1],
    [0,1,0],
    [1,1,0] ],

[   [1,0,0],
    [1,1,1],
    [0,0,1] ],

[   [1,1,0],
    [0,1,0],
    [0,1,1] ],

[   [1,0,0],
    [1,1,1],
    [0,0,1] ],

]

const t = [
    // L //
[   [1,1,1],
    [0,1,0],
    [0,1,0] ],

[   [0,0,1],
    [1,1,1],
    [0,0,1] ],

[   [0,1,0],
    [0,1,0],
    [1,1,1] ],

[   [1,0,0],
    [1,1,1],
    [1,0,0] ],

]
        // DRAW PART //////////////////////////////////////////////

                /* ~~~~~~~ prototype ~~~~~~*/ 

        function Piece (teter,color) {
            this.teter = teter ;
            this.teterPosition = 0;
        
            this.activeTeter = this.teter[this.teterPosition];
            this.color = color;

            this.x = 6;
            this.y = -2;

            this.draw = function() {
                for (let y =0; y<this.activeTeter.length; y++) {
                    for(let x=0; x<this.activeTeter.length; x++) {
                        if(this.activeTeter[y][x]) {
                            drawBox(this.x + x, this.y + y, this.color);
                            }
                        }
                    }
                }
            this.unDraw = function() {
                for (let y =0; y<this.activeTeter.length; y++) {
                    for(let x=0; x<this.activeTeter.length; x++) {
                        if(this.activeTeter[y][x]) {
                            drawBox(this.x + x, this.y + y, white);
                            }
                        }
                    }
                }
            this.collision = function(nx,nY,piece) {
                for (let y =0; y<this.activeTeter.length; y++) {
                    for(let x=0; x<this.activeTeter.length; x++) {
                        if(!piece[y][x]) {continue;}

                        let newX = this.x + x + nx;
                        let newY = this.y + y +nY;

                        if(newX <0 || newX >=COLUMNS || newY >=ROWS) {return true;}
                        if(newY<0) {continue}
                        if(board[newY][newX] != white) {return true;}
                    }
                }
                return false;
            }
            this.moveDown =function() {
                if(!this.collision(0,1,this.activeTeter)) {
                    this.unDraw();
                    this.y ++;
                    this.draw();
                }
            }   
            this.moveLeft =function() {
                if(!this.collision(-1,0,this.activeTeter)) {
                    this.unDraw();
                    this.x --;
                    this.draw(); 
                }
            }   
            this.moveRight =function() {
                if(!this.collision(1,0,this.activeTeter)) {
                    this.unDraw();
                    this.x ++ 
                    this.draw();
                }
            }   
            this.rotate =function() {
                let nextPattern = this.teter[(this.teterPosition +1 ) % this.teter.length];
                let kick = 0;

                if (this.collision(0,0,nextPattern)) {
                    if(this.x > COLUMNS/2) {
                        kick = -1;
                    }else {
                        kick = 1;
                    }
                }
                if(!this.collision(kick,0,nextPattern)) {
                    this.unDraw();
                    this.x += kick;
                    this.teterPosition = (this.teterPosition + 1 ) % this.teter.length;
                    this.activeTeter = this.teter[this.teterPosition];
                    this.draw();
                    }
                }    
            }
        
                /* ~~~~~~~ Pice ~~~~~~*/
            (function setup(){
                // choose a random piece //
            const teterminoes = [ [z,"red"], [l,"green"], [s,"blue"], [i,"yellowgreen"], [t,"yellow"] ];

            let randomN = Math.floor(Math.random()*teterminoes.length);
            
            let newPeice = new Piece(teterminoes[randomN][0],teterminoes[randomN][1]);

                // drop pieces //
            window.setInterval( () => {
                if(!newPeice.collision(0,1,newPeice.activeTeter)) {
                    newPeice.unDraw();
                    newPeice.y ++;
                    newPeice.draw(); 
                }            
            }, 500);

            window.addEventListener("keydown", function(ev) {

                const key = ev.keyCode;   
                console.log(key);
                         
                if(key === 37) {
                    newPeice.moveLeft();
                }
                if(key === 39) {
                    newPeice.moveRight();
                }
                if(key === 40) {
                    newPeice.moveDown();
                }
                if(key === 38) {
                    newPeice.rotate();
                }
            });
            }());

// IV. MOVE the PICE :  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


