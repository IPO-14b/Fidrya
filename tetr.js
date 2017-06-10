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
  },
  startBtn: document.getElementById('start-btn')
};
//В самом начале игры на поле нет ни одного кирпичика. Значит, все клетки пустые. Заполним массив bricks нулями.
for (var i = 0; i < Tetris.pitch.height; i++) {
  Tetris.pitch.bricks[i] = [];
  for (var j = 0; j < Tetris.pitch.width; j++) {
    Tetris.pitch.bricks[i][j] = 0;
  }
}
// Найдем на странице элемент, в котором будем рисовать тетрис
var tetrisDom = document.getElementById(Tetris.config.pitchID);

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
