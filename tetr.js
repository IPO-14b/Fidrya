/**
*@var object Объект который хранить данные фигур и стили
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
        speed: 500,
        figureTypes: {
            /**
            *Функция возвращает фигуру палочку
            *@return int[][] возвращает массив координат
            */
            I: function() {
                return [
                    [[-3,5]],
                    [[-2,5]],
                    [[-1,5]],
                    [[ 0,5]]
            	];
            },
            /**
            *Функция возвращает перевёрнутую Г в лево
            *@return int[][] возвращает массив координат
            */
            J: function() {
                return [
                             [[-2,6]],
                             [[-1,6]],
                    [[0,5],[0,6]]
            ];
            },
            /**
            *Функция возвращает перевернутую Г вправо
            *@return int[][] возвращает массив координат
            */
            L: function() {
                return [
                    [[-2,5]],
                    [[-1,5]],
                    [[0,5],[0,6]]
            ];
            },
            /**
            *Функция возвращает квадрат
            *@return int[][] возвращает массив координат
            */
            O: function() {
                return [
                [[-1,5],[-1,6]],
                [[ 0,5], [0,6]]
            ];
            },
            /**
            *Функция возвращает Z образную фигуру в лево
            *@return int[][] возвращает массив координат
            */
            S: function() {
                return [
                            [[-1,6],[-1,7]],
                [[0,5], [0,6]]
            ];
            },
            /**
            *Функция возвращает Т образную фигуру
            *@return int[][] возвращает массив координат
            */
            T: function() {
                return [
                [[-1,5],[-1,6],[-1,7]],
                             [[0,6]]
            ];
            },
            /**
            *Функция возвращает Z образную фигуру вправо
            *@return int[][] возвращает массив координат
            */
            Z: function() {
                return [
                        [[-1,4],[-1,5]],
                                        [[0,5], [0,6]]
                    ];
            }
        }
},
    startBtn: document.getElementById('start-btn')
    /**
    *@param pitch параметры кнопки
    */
    pitch: {
        width: 12,
        height: 20
        bricks: []
    
        /**
            *Функция возвращает имя элемента
            *@return string возвращает имя элемента
        */
        getDom: function() {
            return document.getElementById(Tetris.config.pitchID);
        }
    },
    figure: {
        coords: [],
        /**
        *Функция начала игрового процесса, если он ещё не начат
        */
        go: function() {
        if (this.coords.length == 0) {
            this.create();
        } else {
            this.process();
        }
    },
        /**
        *Функция создания фигуры на поле
        */
        create: function() {
             this.coords = this.getRandomFigure();
    },  
        rotatePosition: 0,
        
        /**
        *Функция поворота фигуры
        *@return boolean выполнение поворота
        */
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
        
        /**
        *Функция поворота в обратном направлении
        */
        rotateRollback: function() {
            	this.setRotatedCoords();
                this.setRotatedCoords();
                this.setRotatedCoords();
        },
        /**
        *Функция изменения координат фигуры при её повороте
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
                                    [this.coords[0][1][0],     this.coords[0][1][1]]
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
        *Функция возвращает рандомную фигуру
        *@return int[][] возвращает координаты фигуры
        */
        getRandomFigure: function() {
        var keys = Object.keys(Tetris.config.figureTypes);
        var randKey = Math.floor(Math.random() * keys.length);
        return Tetris.config.figureTypes[keys[randKey]];
    },
        /**
        *Функция поведения фигуры в разных ситуациях
        */
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
    /**
    *Функция действия фигуры при соприкосновении
    *@return boolean возвращает значение соприкосновении, 
    *true, если было соприкосновение иначе false
    */
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
    /**
    *Функция соединения керпичиков
    */
    joinToBricks: function() {
    Tetris.each(this.coords, function(i,j){
                var figureRow = Tetris.figure.coords[i][j][0];
                var figureCol = Tetris.figure.coords[i][j][1];
                if (figureRow >= 0) {
                    Tetris.pitch.bricks[figureRow][figureCol] = 1;
                }
            });
            // Вот в этом месте фигура уже упала и была объединена с массивом кирпичиков
            // Здесь и будем проверять линии
            Tetris.checkLines();
        },
    /**
    *Функция уничтожении заполненой линии на поле
    */
    destroy: function() {
        // Чтобы освободить место для следующей фигуры, просто чистим координаты
        this.coords = [];
    },
    /**
    *Функция производит шаг фигуры на поле
    */
    makeStep: function() {
        Tetris.each(this.coords, function(i,j){
            Tetris.figure.coords[i][j][0]++;
        });
 },
     rollback: false,// пока ничего не случилось, откатывать ничего не надо
     sideStepSpeed: 0,
     /**
     *Функция производит шаг фигуры в сторону
     */
     sideStep: function(direction) {
            if (!this.sideStepSpeed) {
                this.sideStepSpeed = 50;
                this.sideStepHandler = setInterval(function(){
                    Tetris.figure.sideStep(direction);
                }, this.sideStepSpeed);
            }
        },
        /**
        *Функция производит остановку движения фигуры в сторону
        */
        sideStepStop: function() {
            if (this.sideStepHandler != undefined || !this.sideStepHandler) {
                this.sideStepSpeed = 0;
                clearInterval(this.sideStepHandler);
            }
        },
        /**
        *Функция производит движение фигуры в стороны
        */
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
        
        /**
        *Функция проверки координат на пустоту
        *@return boolean возвращает значение клетки на пустоту
        */
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
    /**
    *Функция инициализаци игрового поля
    */
    init: function() {
        for (var i = 0; i < Tetris.pitch.height; i++) {
            Tetris.pitch.bricks[i] = [];
            for (var j = 0; j < Tetris.pitch.width; j++) {
                Tetris.pitch.bricks[i][j] = 0;
            }
        }
        Tetris.startBtn.onclick = function () {
        // Очищаем игровое поле
            Tetris.clearPitch();
            Tetris.tick();
        }
        window.onkeydown = function (event) {
            var direction = '';
            if (event.keyCode == 39) {
                direction = 'right';
            } else if(event.keyC    == 37) {
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
        
    /**
    *Функция изменения скорости фигуры с выводом в консоли
    */
    tick: function() {
        console.log('tick');
        Tetris.figure.go();
        Tetris.draw();
        if (Tetris.tickHandler === undefined) {
            Tetris.setSpeed();
        }
    },
    currentSpeed: 0,
    /**
    *Функция изменения скорости фигуры
    */
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
    /**
    *Функция очистки шага после фигуры
    */
    clearPitch: function() {
        var tetrisDom = Tetris.pitch.getDom();
        // Очищаем поле
        tetrisDom.innerHTML = '';
        // Рисуем пустые клеточки
        Tetris.each(Tetris.pitch.bricks, function(i,j){
             tetrisDom.innerHTML += Tetris.config.brick;
        });
    },
        
    /**
    *Функция для рисования поля
    */
    draw: function() {
        var tetrisDom = Tetris.pitch.getDom();
        Tetris.each(Tetris.pitch.bricks, function(i,j){
            // Для удобства определяем переменные со свойствами клеток
            var fillBG = Tetris.config.filledBrick.background;
            var freeBG = Tetris.config.freeBrick.background;
            var fillBorder = Tetris.config.filledBrick.border;
            var freeBorder = Tetris.config.freeBrick.border;
            // Рассчитываем порядковый номер клеточки
            var brickIndex = i * Tetris.pitch.width + j;
            // И разукрашиваем её в соответствующий цвет
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
    *Функция проверки игры на окончание
    *@return boolean возвращает значение окончания игры
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
    *Функция проверки линии на заполненность
    */
    checkLines: function() {
        // Построим пустую линию (вдруг пригодится)
        var emptyLine = [];
        for (var i = 0; i < this.pitch.width; i++) {
        	emptyLine.push(0);
        }
        // Пройдемся по строчкам
        for (var i = 0; i < this.pitch.bricks.length; i++) {
            var countFilled = 0; // будем считать количество заполненных клеток
            for (var j = 0; j < this.pitch.bricks[i].length; j++) {
                if (this.pitch.bricks[i][j]) {
                    countFilled++;
                }
            }
            // Если количество заполненных клеток равно ширине игрового поля,
            // значит вся линия заполнена. Её можно убирать
            if (countFilled == this.pitch.width) {
                // Удаляем строку из массива
                this.pitch.bricks.splice(i, 1);
                // И добавляем пустую линию в начало
                this.pitch.bricks.unshift(emptyLine);
            }
        }
    },
        
    /**
    *Функция замены координат
    */
    each: function(coords, callback) {
        for (var i = 0; i < coords.length; i++) {
            for (var j = 0; j < coords[i].length; j++) {
                callback(i,j);
            }
        }
    }
};
Tetris.init();
