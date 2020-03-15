import { Brick } from "./brick.js";

//Общий класс для массива блоков
export class Bricks {
  constructor(canvas, rowCount = 4, columnCount = 6, padding = 10, offsetTop = 20, offsetLeft = 20) {
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;
    this.padding = padding;

    this.brickWidth = (canvas.width - this.padding * (this.columnCount - 1) - this.offsetLeft * 2) / this.columnCount;
    this.brickHeight = 20;

    this.bricks = [];
    this._fillBricksArray(canvas); //Заполняем массив блоков
  }

  //Заполнение массива блоков
  _fillBricksArray(canvas) {
    this.bumpCount = 0;
    for (let c = 0; c < this.columnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rowCount; r++) {
        let brickX = (c * (this.brickWidth + this.padding)) + this.offsetLeft;
        let brickY = (r * (this.brickHeight + this.padding)) + this.offsetTop;
        let brick = new Brick(brickX, brickY, this.brickWidth, this.brickHeight);
        // if (c % 2 == 1 && r % 2 == 0) {
        //   brick.hardness = 2;
        // }

        // if (c % 2 == 0 && r % 2 == 1) {
        //   brick.hardness = 2;
        // }

        this.bricks[c][r] = brick;
        this.bumpCount += brick.hardness;
      }
    }
  }

  get bumpsToWin () {
    return this.bumpCount;
  }

  //Отрисовка блоков
  draw(ctx) {
    for (let c = 0; c < this.columnCount; c++) {
      for (let r = 0; r < this.rowCount; r++) {
        if (this.bricks[c][r].status == 1) {
          this.bricks[c][r].draw(ctx);
        }
      }
    }
  }

  //Установка стартовых значений
  reset() {
    this._fillBricksArray();
  }
}