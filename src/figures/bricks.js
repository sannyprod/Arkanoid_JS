import { Brick } from "./brick.js";

//Общий класс для массива блоков
//levelDeclaration - массив массивов с описанием параметров каждого блока
export class Bricks {
  constructor(canvas, levelDeclaration = null, rowCount = 4, columnCount = 6, padding = 10, offsetTop = 20, offsetLeft = 20) {
    this.rowCount = levelDeclaration?.rowCount|| rowCount;
    this.columnCount = levelDeclaration?.columnCount || columnCount;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;
    this.padding = padding;

    this.brickWidth = (canvas.width - this.padding * (this.columnCount - 1) - this.offsetLeft * 2) / this.columnCount;
    this.brickHeight = 20;

    this.bricks = [];
    this._fillBricksArray(canvas, levelDeclaration); //Заполняем массив блоков
  }

  //Заполнение массива блоков
  _fillBricksArray(canvas, levelDeclaration) {
    this.bumpCount = 0;
    for (let c = 0; c < this.columnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rowCount; r++) {
        let brickX = (c * (this.brickWidth + this.padding)) + this.offsetLeft;
        let brickY = (r * (this.brickHeight + this.padding)) + this.offsetTop;
        let brick = null;

        if (levelDeclaration === null || levelDeclaration.bricks === null || !levelDeclaration.bricks.length) {
          brick = new Brick(brickX, brickY, this.brickWidth, this.brickHeight);
        }
        else {
          let width = levelDeclaration.bricks[c][r].width || this.brickWidth;
          let height = levelDeclaration.bricks[c][r].height || this.brickHeight;
          let x = levelDeclaration.bricks[c][r].x || brickX;
          let y = levelDeclaration.bricks[c][r].y || brickY;
          let bumpsToDestroy = levelDeclaration.bricks[c][r].bumpsToDestroy || 1;
          let status = levelDeclaration.bricks[c][r].status;
          status = status === null ? 1 : status;
          brick = new Brick(x, y, width, height, bumpsToDestroy, status);
        }

        this.bricks[c][r] = brick;
        if (brick.status === 1) {
          this.bumpCount += brick.hardness;
        }
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
  reset(canvas, levelDeclaration = null) {
    this._fillBricksArray(canvas, levelDeclaration);
  }
}