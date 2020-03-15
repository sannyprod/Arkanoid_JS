import { Figure } from "./figure.js";

//Класс для блока
export class Brick extends Figure {
  constructor(x,
              y,
              width,
              height,
              color = null) {
    super(x, y, color);
    this.width = width;
    this.height = height;
    this.status = 1; //Для проверки столкновений и отрисовки блоков
    this.bumpToDestroy = 1;
  }

  set hardness(value) {
    this.bumpToDestroy = value;
    if (value == 1) {
      this.color = "#666";
    }
    else if (value == 2) {
      this.color = "rgba(200, 150, 0, 1)";
    }
    else {
      this.color = "rgba(200, 50, 0, 1)";
    }
    // this.color = "rgba(200, 150, 0, 1)";
  }

  get hardness() {
    return this.bumpToDestroy;
  }

  checkDestroy() {
    this.hardness -= 1;
    if (this.hardness == 0) {
      this.status = 0;
    }
  }

  //Вывод блока на игровую область
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}