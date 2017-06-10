var Tetris = {
  config: {
    pitchID: "tetris",
    freeBrick: "<b></b>",
    filledBrick: "<i></i>"
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
      this.coords = [0,6];
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
    // Следующий шаг - значит, увеличиваем координату фигуры
    this.coords[0]++;
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
   }
  }
 }
};
Tetris.init();
