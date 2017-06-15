/**
*
*параметры программы
*
*@var object Tetris
*@var string pitchID
*@var object brick
*@var int background
*@var string border
*@var int speed
*/
var Tetris = {
  config: {
    pitchID: "tetris",
    brick: "<b></b>",
    freeBrick: {
      background: "#000",
      border: "1px solid #333"
    },
    filledBrick: {
      background: "#fff",
      border: "1px solid #999"
    },
    speed: 1000,
    /**
    *
    *функции построения фигур
    *@param i
    *@param j
    *@param l
    *@param o
    *@param i
    *@param s
    *@param t
    *@param z
    */
    figureTypes: {
      I: function() {
        return [
          [[-3,5]],
          [[-2,5]],
          [[-1,5]],
          [[ 0,5]]
      	];
      },
      J: function() {
        return [
               [[-2,6]],
               [[-1,6]],
          [[0,5],[0,6]]
      ];
      },
      L: function() {
        return [
          [[-2,5]],
          [[-1,5]],
          [[0,5],[0,6]]
      ];
      },
      O: function() {
        return [
        [[-1,5],[-1,6]],
        [[ 0,5], [0,6]]
      ];
      },
      S: function() {
        return [
              [[-1,6],[-1,7]],
        [[0,5], [0,6]]
      ];
      },
      T: function() {
        return [
        [[-1,5],[-1,6],[-1,7]],
               [[0,6]]
      ];
      },
      Z: function() {
        return [
            [[-1,4],[-1,5]],
                    [[0,5], [0,6]]
          ];
      }
    }
  },
  
  
  /**
  *
  *функция getdome
  *
  *@param geDome
  *
  */
  startBtn: document.getElementById('start-btn'),
  pitch: {
    width: 12,
    height: 20,
    bricks: [],
    getDom: function() {
      return document.getElementById(Tetris.config.pitchID);
    }
  },
  
  
  /**
  *
  *@param go
  *
  */
  figure: {
		coords: [],
    go: function() {
      if (this.coords.length == 0) {
        this.create();
      } else {
        this.process();
      }
    },
    
    
  /**
  *
  *функция создания рандомной фигуры
  *
  *@param create
  *
  */
    create: function() {
      this.getRandomFigure();
    },
    
  /**
  *
  *функция кручения фигуры
  *
  *@var int rotatePosition
  *@param create
  *
  *
  */
    rotatePosition: 0,
    rotate: function() {
      if (this.coords.length == 0) {
        return false;
      }
      this.setRotatedCoords();
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureCol < 0) {
          Tetris.figure.needStepSide = 'right';
        }
        if (figureCol >= Tetris.pitch.width) {
          Tetris.figure.needStepSide = 'left';
        }
      });
      if (this.needStepSide) {
        this.sideStep(this.needStepSide);
        this.needStepSide = false;
      }
      if (this.touched()) {
        this.rotateRollback();
        return false;
      }
      Tetris.draw();
    },
    needStepSide: false,
    rotateRollback: function() {
      	this.setRotatedCoords();
        this.setRotatedCoords();
        this.setRotatedCoords();
    },
    
    
  /**
  *
  *функция определения стороны вращения
  *
  *@var string newCoords
  *@param setRotateCoords
  *
  */
    setRotatedCoords: function() {
      var newCoords = [];
      switch(this.type) {
        case 'I':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[2][0][0], this.coords[2][0][1]-1],
                  [this.coords[2][0][0], this.coords[2][0][1]],
                  [this.coords[2][0][0], this.coords[2][0][1]+1],
                  [this.coords[2][0][0], this.coords[2][0][1]+2]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][1][0]-2, this.coords[0][1][1]]
                ],[
                  [this.coords[0][1][0]-1, this.coords[0][1][1]]
                ],[
                  [this.coords[0][1][0],   this.coords[0][1][1]]
                ],[
                  [this.coords[0][1][0]+1, this.coords[0][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'S':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
                ],[
                  [this.coords[1][1][0]+1, this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]+1],
                	[this.coords[0][0][0], this.coords[0][0][1]+2]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'Z':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][1][0], this.coords[0][1][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-2],
                	[this.coords[0][0][0], this.coords[0][0][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'T':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][1][0]-1, this.coords[0][1][1]]
                ],[
                  [this.coords[0][0][0], this.coords[0][0][1]],
                  [this.coords[0][1][0], this.coords[0][1][1]]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 2;
              break;
            case 2:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]]
                ],[
                  [this.coords[1][1][0], this.coords[1][1][1]],
                  [this.coords[1][2][0], this.coords[1][2][1]]
                ],[
                  [this.coords[1][1][0]+1, this.coords[1][1][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 3;
              break;
            case 3:
              newCoords.push([
                  [this.coords[1][0][0], this.coords[0][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][1][0], this.coords[1][1][1]]
                ],[
                  [this.coords[2][0][0], this.coords[2][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'J':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]],
                  [this.coords[0][0][0], this.coords[0][0][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 2;
              break;
            case 2:
              newCoords.push([
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 3;
              break;
            case 3:
              newCoords.push([
                  [this.coords[0][1][0]-1, this.coords[0][1][1]+1]
                ],[
                  [this.coords[0][1][0], this.coords[0][1][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
        case 'L':
          switch(this.rotatePosition) {
            case 0:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]+1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]-1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 1;
              break;
            case 1:
              newCoords.push([
                  [this.coords[0][0][0], this.coords[0][0][1]-1],
                  [this.coords[0][0][0], this.coords[0][0][1]]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]+2]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]+2]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 2;
              break;
            case 2:
              newCoords.push([
                  [this.coords[1][0][0], this.coords[1][0][1]+1],
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]-1]
                ],[
                  [this.coords[1][0][0]+1, this.coords[1][0][1]-1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 3;
              break;
            case 3:
              newCoords.push([
                  [this.coords[0][1][0]-1, this.coords[0][1][1]-1]
                ],[
                  [this.coords[0][1][0], this.coords[0][1][1]-1]
                ],[
                  [this.coords[1][0][0], this.coords[1][0][1]],
                  [this.coords[1][0][0], this.coords[1][0][1]+1]
              ]);
              this.coords = newCoords;
              this.rotatePosition = 0;
              break;
          }
          break;
      }
    },
    
    
  /**
  *
  *функция отрисовки рандомной фигуры
  *
  *@var object keys
  *@var math randKey
  *@param getRandomFigure
  *
  */
    getRandomFigure: function() {
      var keys = Object.keys(Tetris.config.figureTypes);
      var randKey = Math.floor(Math.random() * keys.length);
      Tetris.figure.type = keys[randKey];
      this.coords = Tetris.config.figureTypes[keys[randKey]]();
      var rotatePosition = Math.floor(Math.random() * 4);
      if (rotatePosition) {
        for (var i = 0; i < rotatePosition; i++) {
          this.setRotatedCoords();
        }
      }
      console.log(rotatePosition);
    },
    process: function() {
      if (this.touched()) {
        this.joinToBricks();
        if (!Tetris.checkGameOver()) {
        	this.destroy();
          this.create();
        }
      } else {
        this.makeStep();
      }
    },
    
    
  /**
  *
  *функция определения нажатия клавиши
  *
  *@var bool contact
  *@param t
  *
  */
    touched: function() {
      var contact = false;
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        if (figureRow >= 0 && Tetris.pitch.bricks[figureRow + 1]  == undefined) {
          contact = true;
        }
      });
      if (contact) {
        return contact;
      }
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureRow >= 0 && Tetris.pitch.bricks[figureRow + 1][figureCol]) {
          contact = true;
        }
      });
      if (contact) {
        return contact;
      }
      return false;
    },
    
  /**
  *
  *функция соединения керпичей
  *
  *@var int figureRow
  *@var int figureCol
  *@param d
  *
  */
    joinToBricks: function() {
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureRow >= 0) {
          Tetris.pitch.bricks[figureRow][figureCol] = 1;
        }
      });
      Tetris.checkLines();
    },
    
  /**
  *
  *функция определения разрушения линии
  *
  *@param d
  *
  */
    destroy: function() {
      this.coords = [];
      this.rotatePosition = 0;
    },
    
  /**
  *
  *функция движения фигуры
  *
  *@param m
  *
  */
    makeStep: function() {
      Tetris.each(this.coords, function(i,j){
        Tetris.figure.coords[i][j][0]++;
      });
    },
    rollback: false,
    sideStepSpeed: 0,
    sideStepStart: function(direction) {
      if (!this.sideStepSpeed) {
        this.sideStepSpeed = 50;
        this.sideStepHandler = setInterval(function(){
          Tetris.figure.sideStep(direction);
        }, this.sideStepSpeed);
      }
    },
    
    
    sideStepStop: function() {
      if (this.sideStepHandler != undefined || !this.sideStepHandler) {
        this.sideStepSpeed = 0;
        clearInterval(this.sideStepHandler);
      }
    },
    
    sideStep: function(direction) {
      Tetris.each(this.coords, function(i,j){
        if (direction == 'right') {
        	Tetris.figure.coords[i][j][1]++;
        } else {
          Tetris.figure.coords[i][j][1]--;
        }
      });
      Tetris.each(this.coords, function(i,j){
        var coord = Tetris.figure.coords[i][j];
        var brick;
        if (coord[0] >= 0) {
          brick = Tetris.pitch.bricks[coord[0]][coord[1]];
          if (brick == undefined) {
            Tetris.figure.rollback = true;
          }
        }
        if (Tetris.pitch.bricks[coord[0]] != undefined) {
          brick = Tetris.pitch.bricks[coord[0]][coord[1]];
          if (brick == 1) {
            Tetris.figure.rollback = true;
          }
        }
      });
      if (this.rollback) {
        Tetris.each(this.coords, function(i,j){
          if (direction == 'right') {
            Tetris.figure.coords[i][j][1]--;
          } else {
            Tetris.figure.coords[i][j][1]++;
          }
        });
        this.rollback = false;
      } else {
        Tetris.draw();
      }
    },
    checkCoords: function(row, col) {
      var checked = false;
      Tetris.each(this.coords, function(i,j){
        var figureRow = Tetris.figure.coords[i][j][0];
        var figureCol = Tetris.figure.coords[i][j][1];
        if (figureRow == row) {
          if (figureCol == col) {
            checked = true;
          }
        }
      });
      return checked;
    }
  },
  
  
  init: function() {
    for (var i = 0; i < Tetris.pitch.height; i++) {
      Tetris.pitch.bricks[i] = [];
      for (var j = 0; j < Tetris.pitch.width; j++) {
        Tetris.pitch.bricks[i][j] = 0;
      }
    }
    Tetris.startBtn.onclick = function () {
      Tetris.clearPitch();
			Tetris.tick();
    }
    window.onkeydown = function (event) {
      var direction = '';
      if (event.keyCode == 39) {
        direction = 'right';
      } else if(event.keyCode == 37) {
        direction = 'left';
      }
      if (direction) {
        Tetris.figure.sideStepStart(direction);
      } else if(event.keyCode == 40) {
        Tetris.setSpeed(30);
      }
      if (event.keyCode == 38) {
        Tetris.figure.rotate();
      }
    }
    
    
    window.onkeyup = function (event) {
      var direction = '';
      if (event.keyCode == 39) {
        direction = 'right';
      } else if(event.keyCode == 37) {
        direction = 'left';
      }
      if (direction) {
        Tetris.figure.sideStepStop();
      } else if(event.keyCode == 40) {
        Tetris.setSpeed();
      }
    }
  },
  
  
  tick: function() {
    console.log('tick');
    Tetris.figure.go();
    Tetris.draw();
    if (Tetris.tickHandler === undefined) {
      Tetris.setSpeed();
    }
  },
  
  
  currentSpeed: 0,
  setSpeed: function(speed) {
    if (!speed) var speed = Tetris.config.speed;
    if (speed != this.currentSpeed) {
      if (Tetris.tickHandler !== undefined) {
        clearInterval(Tetris.tickHandler);
      }
      Tetris.tickHandler = setInterval(function(){
        Tetris.tick();
      }, speed);
      this.currentSpeed = speed;
    }
  },
  
  
  clearPitch: function() {
    var tetrisDom = Tetris.pitch.getDom();
    tetrisDom.innerHTML = '';
    Tetris.each(Tetris.pitch.bricks, function(i,j){
      tetrisDom.innerHTML += Tetris.config.brick;
    });
  },
  
  
  draw: function() {
    var tetrisDom = Tetris.pitch.getDom();
    Tetris.each(Tetris.pitch.bricks, function(i,j){
      var fillBG = Tetris.config.filledBrick.background;
      var freeBG = Tetris.config.freeBrick.background;
      var fillBorder = Tetris.config.filledBrick.border;
      var freeBorder = Tetris.config.freeBrick.border;
      var brickIndex = i * Tetris.pitch.width + j;
      if (Tetris.pitch.bricks[i][j] || Tetris.figure.checkCoords(i,j)) {
        tetrisDom.getElementsByTagName('b')[brickIndex].style.background = fillBG;
        tetrisDom.getElementsByTagName('b')[brickIndex].style.border = fillBorder;
      } else {
        tetrisDom.getElementsByTagName('b')[brickIndex].style.background = freeBG;
        tetrisDom.getElementsByTagName('b')[brickIndex].style.border = freeBorder;
      }
    });
  },
  
  /**
  *
  *функция определения конца игры
  *
  *
  *@var bool gameover
  *@param C
  *
  */
  checkGameOver: function() {
    var gameover = false;
    Tetris.each(Tetris.figure.coords, function(i,j){
      var figureRow = Tetris.figure.coords[i][j][0];
      if (figureRow == 0 && !gameover) {
        alert('Game over');
        clearInterval(Tetris.tickHandler);
        gameover = true;
      }
    });
    return gameover;
  },
  
  /**
  *
  *функция определения границы карты
  *
  *@var object emptyLine
  *@param checkLines
  *
  */
  checkLines: function() {
    var emptyLine = [];
    for (var i = 0; i < this.pitch.width; i++) {
    	emptyLine.push(0);
    }
    for (var i = 0; i < this.pitch.bricks.length; i++) {
      var countFilled = 0;
      for (var j = 0; j < this.pitch.bricks[i].length; j++) {
        if (this.pitch.bricks[i][j]) {
          countFilled++;
        }
      }
      if (countFilled == this.pitch.width) {
        this.pitch.bricks.splice(i, 1);
        this.pitch.bricks.unshift(emptyLine);
      }
    }
  },
  each: function(coords, callback) {
    for (var i = 0; i < coords.length; i++) {
      for (var j = 0; j < coords[i].length; j++) {
        callback(i,j);
      }
    }
  }
};
Tetris.init();
