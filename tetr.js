var Tetris = {
  config: {
    pitchID: "tetris",
    freeBrick: "<b></b>",
    filledBrick: "<i></i>"
},
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
startBtn: document.getElementById('start-btn')
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
