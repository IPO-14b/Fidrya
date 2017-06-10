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
    console.log('tick');
    setInterval(function(){
        Tetris.tick();
    }, 1000);
  }
    // Приказываем тетрису нарисовать кадр
    Tetris.draw();
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
    // Добавляя на игровое поле пустой или заполненный кирпичик
    // (если в массиве кирпичиков 1, ставим заполненный кирпичик, если 0 - пустой)
    tetrisDom.innerHTML += Tetris.pitch.bricks[i][j]
                         ? Tetris.config.filledBrick
                         : Tetris.config.freeBrick;
    
   }
  }
 }
};
Tetris.init();
