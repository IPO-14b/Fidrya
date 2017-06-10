var Tetris = {
  config: {
    pitchID: "tetris",
    freeBrick: "<b></b>",
    filledBrick: "<i></i>",
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
   sideStep: function(direction) {
      // Менять координату нужно у каждого кирпичика в составе фигуры
      Tetris.each(this.coords, function(i,j){
        if (direction == 'right') {
          Tetris.figure.coords[i][j][1]++;
        } else {
          Tetris.figure.coords[i][j][1]--;
        }
      });
     // проверяем - не нарушены ли правила
      Tetris.each(this.coords, function(i,j){
        var coord = Tetris.figure.coords[i][j];
        var brick;
        // у тех кирпичиков, которые уже появились на поле (у которых
        // неотрицательная координата), проверяем - не уткнулись ли мы в стену
        if (coord[0] >= 0) {
          brick = Tetris.pitch.bricks[coord[0]][coord[1]];
          // если клеточки не существует, значит, кирпичик «вылез» за пределы поля
          if (brick == undefined) {
            // устанавливаем флаг «откатить»
            Tetris.figure.rollback = true;
          }
        }
        // даже если мы не пересекли границы поля, мы могли все равно «уткнуться»,
        // например, в кирпичик, который уже занимает клетку на поле
        if (Tetris.pitch.bricks[coord[0]] != undefined) {
          brick = Tetris.pitch.bricks[coord[0]][coord[1]];
          if (brick == 1) {
            // в таком случае также устанавливаем флаг в true
            Tetris.figure.rollback = true;
          }
        }
      });
      // Проверяем - был ли ранее установлен флаг
      if (this.rollback) {
        // Если да, то меняем координаты в обратную сторону
        Tetris.each(this.coords, function(i,j){
          if (direction == 'right') {
            Tetris.figure.coords[i][j][1]--;
          } else {
            Tetris.figure.coords[i][j][1]++;
          }
        });
        // Не забываем переключить флаг обратно, чтобы не заблокировать
        // все последующие перемещения
        this.rollback = false;
      } else {
        // если же откатываться не надо, спокойно нарисуем новую позицию фигуры
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
//В самом начале игры на поле нет ни одного кирпичика. Значит, все клетки пустые. Заполним массив bricks нулями.
for (var i = 0; i < Tetris.pitch.height; i++) {
  Tetris.pitch.bricks[i] = [];
  for (var j = 0; j < Tetris.pitch.width; j++) {
    Tetris.pitch.bricks[i][j] = 0;
   }
 }
// Если пользователь кликнул по кнопке «Старт»
Tetris.startBtn.onclick = function () {
  // Заменяем вызов метода draw на вызов метода tick
        Tetris.tick();
    }
window.onkeydown = function (event) {
      var direction = '';
      if (event.keyCode == 39) {
        direction = 'right';
      } else if(event.keyCode == 37) {
        direction = 'left';
      }
  // Если нажали кнопку «Влево» или «Вправо»
      if (direction) {
        // «Прикажем» фигуре подвинутся в соответствующем направлении
        Tetris.figure.sideStep(direction);
      } else if(event.keyCode == 40) {//код кнопки «Вниз»
        Tetris.tick();
      }
    }
  },
 tick: function() {
    Tetris.draw();
    Tetris.i = Tetris.i || 0;
    Tetris.i++;
    alert(Tetris.i);
    if (Tetris.i >= 3) {
    	clearInterval(Tetris.tickHandler);
    }
    if (Tetris.tickHandler === undefined) {
      Tetris.tickHandler = setInterval(function(){
        Tetris.tick();
      }, 1000);
    }
  },
draw: function() {
// А вот здесь вызовем метод getDom и присвоим его вывод переменной
var tetrisDom = Tetris.pitch.getDom();
// Очистим на всякий случай его
tetrisDom.innerHTML = '';
// И пробежимся по массиву кирпичиков
for (var i = 0; i < Tetris.pitch.bricks.length; i++) {
  for (var j = 0; j < Tetris.pitch.bricks[i].length; j++) {
    // Проверяем, есть ли кирпичик
        if (Tetris.pitch.bricks[i][j] ||
           // ИЛИ есть ли по этим координатам фигура
           (Tetris.figure.coords[0] == i &&
            Tetris.figure.coords[1] == j )) {
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
