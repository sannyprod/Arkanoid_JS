import { Figure } from "./figure.js";

//Платформа, которой мы управляем и отбиваем шарик
export class Paddle extends Figure {
  constructor(canvas, color = null, width = 100, height = 10, speed = 10) {
    super(0, 0, color);
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.reset(canvas); //Установка начальных значений
  }

  //ctx - CanvasRenderingContext2D - элемент для рендера 2D поверхности
  //Процедура отрисовки платформы (должна вызываться каждый кадр)
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  //Установка стартовых значений
  reset(canvas) {
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height;
  }

  //canvas - html элемент canvas, необходим для рассчета столкновений с границей игровой зоны
  //leftPressed - для движения влево
  //rightPressed - для движения вправо
  //Процедура для перемещения платформы (должна вызываться каждый кадр)
  move(canvas, leftPressed, rightPressed) {
    if (leftPressed && rightPressed) {
        return;
    }
    else if (leftPressed) {
        this.x -= this.speed;
        if (this.x < 2) {
            this.x = 2;
        }
    }
    else if (rightPressed) {
      this.x += this.speed;
      if (this.x + this.width > canvas.width - 2) {
          this.x = canvas.width - this.width - 2;
      }
    }
  }
}