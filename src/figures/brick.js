import { Figure } from "./figure.js";

//Класс для блока
export class Brick extends Figure {
  constructor(x,
              y,
              width,
              height,
              bumpsToDestroy = 1,
              status = 1,
              color = null) {
    super(x, y, color);
    this.width = width;
    this.height = height;
    this.status = status; //Для проверки столкновений и отрисовки блоков
    this.bumpsToDestroy = bumpsToDestroy;
  }

  _setColor(currentLevel) {
    let color1 = "";
    let color2 = "";
    let color3 = "";
    if (currentLevel === 0) {
      color1 = "rgb(14, 146, 9)";
      color2 = "rgb(10, 89, 7)";
      color3 = "rgb(6, 49, 4)";
      this._setBumpColor(color1, color2, color3);
    }
    else if (currentLevel === 1) {
      color1 = "rgb(13, 118, 252)";
      color2 = "rgb(9, 63, 131)";
      color3 = "rgb(5, 29, 59)";
      this._setBumpColor(color1, color2, color3);
    }
    else if (currentLevel === 2) {
      color1 = "rgb(248, 87, 7)";
      color2 = "rgb(131, 47, 5)";
      color3 = "rgb(63, 23, 3)";
      this._setBumpColor(color1, color2, color3);
    }
  }

  _setBumpColor(color1, color2, color3) {
    if (this.bumpsToDestroy == 1) {
        this.color = color1;
      }
      else if (this.bumpsToDestroy == 2) {
        this.color = color2;
      }
      else {
        this.color = color3;
      }
  }

  set hardness(value) {
    this.bumpsToDestroy = value;
  }

  get hardness() {
    return this.bumpsToDestroy;
  }

  checkDestroy() {
    this.hardness -= 1;
    if (this.hardness == 0) {
      this.status = 0;
    }
  }

  //Вывод блока на игровую область
  draw(ctx, currentLevel) {
    if (!this.status) {
      return;
    }
    this._setColor(currentLevel);
    
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    this._drawBorder(ctx);
  }

  _drawBorder(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  }
}