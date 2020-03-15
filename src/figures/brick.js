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

  _setColor() {
    if (this.bumpsToDestroy == 1) {
      this.color = "#666";
    }
    else if (this.bumpsToDestroy == 2) {
      this.color = "rgba(200, 150, 0, 1)";
    }
    else {
      this.color = "rgba(200, 50, 0, 1)";
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
  draw(ctx) {
    if (!this.status) {
      return;
    }
    this._setColor();
    
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}