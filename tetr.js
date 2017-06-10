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
  }
};
//В самом начале игры на поле нет ни одного кирпичика. Значит, все клетки пустые. Заполним массив bricks нулями.
for (var i = 0; i < Tetris.pitch.height; i++) {
  Tetris.pitch.bricks[i] = [];
  for (var j = 0; j < Tetris.pitch.width; j++) {
    Tetris.pitch.bricks[i][j] = 0;
  }
}
