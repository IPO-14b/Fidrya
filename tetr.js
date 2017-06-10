var Tetris = {
  config: {
    pitchID: "tetris",
    freeBrick: "<b></b>",
    filledBrick: "<i></i>",
    speed: 500,
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
  startBtn: document.getElementById('start-btn')
  pitch: {
    width: 12,
    height: 20
    bricks: []
    getDom: function() {
      return document.getElementById(Tetris.config.pitchID);
    }
  },
  figure: {
    coords: [],
    go: function() {
    if (this.coords.length == 0) {
      this.create();
    } else {
      this.process();
    }
  },
    create: function() {
       this.coords = this.getRandomFigure();
  },  
    getRandomFigure: function() {
    var keys = Object.keys(Tetris.config.figureTypes);
    var randKey = Math.floor(Math.random() * keys.length);
    return Tetris.config.figureTypes[keys[randKey]];
  },
    process: function() {
    // Если фигура соприкоснулась со стенкой или кирпичиком
    if (this.touched()) {
      // Объединяем её с массивом кирпичиков
      this.joinToBricks();
      // Проверяем, не закончилась ли игра
      if (!Tetris.checkGameOver()) {
        // Если нет - освобождаем место для новой фигуры
        this.destroy();
      }
    } else {
      // Если прикосновения не было, фигура делает один шаг вниз
      this.makeStep();
    }
  },
   touched: function() {
    // Если следующей после фигуры строки в массиве кирпичиков не существует,
    // значит мы достигли нижнего края поля. Поэтому возвращаем true - соприкосновение есть
    if (Tetris.pitch.bricks[this.coords[0] + 1] == undefined) {
      return true;
    }
    // Если на следующей строчке кирпичик есть
    // значит, мы с ним соприкоснулись
    if (Tetris.pitch.bricks[this.coords[0] + 1][this.coords[1]]) {
      return true;
    }
    // Если ни одно из условий не выполнено - значит, соприкосновения нет
    return false;
  },
  joinToBricks: function() {
    // Берем координаты фигуры и на её месте ставим кирпичик
    // (1 - значит, клеточка занята кирпичиком, 0 - клеточка пустая,
    // поэтому ставим единичку)
    Tetris.pitch.bricks[this.coords[0]][this.coords[1]] = 1;
  },
  destroy: function() {
    // Чтобы освободить место для следующей фигуры, просто чистим координаты
    this.coords = [];
  },
  makeStep: function() {
    Tetris.each(this.coords, function(i,j){
      Tetris.figure.coords[i][j][0]++;
    });
 },
   rollback: false,// пока ничего не случилось, откатывать ничего не надо
   sideStepSpeed: 0,
   sideStep: function(direction) {
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
  draw: function() {
    var tetrisDom = Tetris.pitch.getDom();
    tetrisDom.innerHTML = '';
    Tetris.each(Tetris.pitch.bricks, function(i,j){
      if (Tetris.pitch.bricks[i][j] || Tetris.figure.checkCoords(i,j)) {
        tetrisDom.innerHTML += Tetris.config.filledBrick;
      } else {
        tetrisDom.innerHTML += Tetris.config.freeBrick;
      }
    });
  },
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
  each: function(coords, callback) {
    for (var i = 0; i < coords.length; i++) {
      for (var j = 0; j < coords[i].length; j++) {
        callback(i,j);
      }
    }
  }
};
Tetris.init();
