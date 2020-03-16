import { Figure } from "./figure.js";
import { Point } from "../service/point.js";
import { intersection } from "../service/collision.js";

//ШАР!!!
export class Ball extends Figure {
  constructor(canvas, color = null, radius = 10) {
    super(0, 0, color);
    this.radius = radius;
    this.reset(canvas); //Установка стартовых значений
  }

  //ctx - CanvasRenderingContext2D - элемент для рендера 2D поверхности
  //Процедура отрисовки шара (должна вызываться каждый кадр)
  draw(ctx) {
    ctx.beginPath();
    // ctx.shadowColor = "#999";
    // ctx.shadowBlur = 10;
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // ctx.shadowBlur = 0;
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;
  }

  //Установка стартовых значений
  reset(canvas) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 1.5;
    if (Math.round(Math.random() * 100) % 2) {
      this.dx = -6;
    }
    else {
      this.dx = 6;
    }
    this.dy = -6;
  }

  //canvas - html элемент canvas, необходим для рассчета столкновений с границей игровой зоны
  //paddle - для проверки столкновений с платформой
  //bricks - для проверки столкновений с блоками, которые надо разбивать
  //Процедура для перемещения шара (должна вызываться каждый кадр)
  move(canvas, paddle, bricks) {
    this._checkCollisions(canvas, paddle, bricks); //Проверяем столкновения
    this.x += this.dx; //Перемещаем шар по горизонтали
    this.y += this.dy; //Перемещаем шар по вертикали
  }

  //Проверяем столкновения
  _checkCollisions(canvas, paddle, bricks) {
    let eventName = ""; //Имя события которое надо вызвать при обнаружении столкновения
    //Предполагаем, что за раз может произойти только одно столкновение
    //TODO

    let paddleCollision = this._checkPaddleCollisions(paddle); //Проверяем столкновение с платформой
    if (paddleCollision) {
      eventName = paddleCollision;
    }

    let wallCollision = this._checkWallCollisions(canvas); //Проверяем столкновение с границами игровой области
    if (wallCollision) {
      eventName = wallCollision;
    }

    let brickCollision = this._checkBricksCollisions(bricks); //Проверяем столкновение с блоками
    if (brickCollision) {
      eventName = brickCollision;
    }

    if (eventName !== "") {
      document.dispatchEvent(new Event(eventName)); //Вызываем событие, если произошло столкновение
      //Для проигрывания звука, отнятия жизни, прибавления очков
    }
  }

  //Проверка столкновение с границами игровой области
  _checkWallCollisions(canvas) {
    if (this.x - this.radius + this.dx < 0) {
      this.x = this.radius;
      this.dx = -this.dx;
      return "bounce";
    } 
    else if (this.x + this.radius + this.dx > canvas.width) {
      this.x = canvas.width - this.radius;
      this.dx = -this.dx;
      return "bounce";
    }

    if (this.y - this.radius + this.dy < 0) {
      this.y = this.radius;
      this.dy = - this.dy;
      return "bounce";
    } 
    else if (this.y + this.radius > canvas.height) {
      this.dy = - this.dy;
      return "lifeLose"
      // this.reset(game.canvas);
      // game.sounds.lifeLose.play();
      // game.lives--;
    }
  }

  //Проверка столкновение с платформой
  _checkPaddleCollisions(paddle) {

    // let point1 = new Point(this.x, this.y);
    // let point2 = new Point(this.x + this.radius, this.y + this.radius + this.dy);

    // let point3 = new Point(paddle.x, paddle.y);
    // let point4 = new Point(paddle.x + paddle.width, paddle.y);

    // console.log(intersection(point1, point2, point3, point4));

  
    //top edge
    if (this.y + this.radius + this.dy > paddle.y && this.x + this.radius > paddle.x && this.x - this.radius < paddle.x + paddle.width) {
      this.y = paddle.y - this.dy;

      let delta = paddle.x + paddle.width/2 - this.x; //Рассчет отскока
      delta = delta == 0 ? 0.1 : delta;
      this.dx = -(delta / 6);
      
      let deltaY = Math.abs(12 - Math.abs(delta / 6)); //Рассчет отскока
      deltaY = deltaY == 0 ? 0.1 : deltaY;
      this.dy = -deltaY;

      return "bounce";
    }
  }

  //Проверка столкновение с блоками
  _checkBricksCollisions(bricks) {
    let pointCenter = new Point(this.x, this.y);
    let pointMoveToRightBottom = new Point(this.x + this.radius + this.dx, this.y + this.radius + this.dy);
    let pointMoveToLeftBottom = new Point(this.x - this.radius + this.dx, this.y + this.radius + this.dy);
    let pointMoveToRightTop = new Point(this.x + this.radius + this.dx, this.y - this.radius + this.dy);
    let pointMoveToLeftTop = new Point(this.x - this.radius + this.dx, this.y - this.radius + this.dy);

    for (let c = 0; c < bricks.columnCount; c++) {
      for (let r = 0; r < bricks.rowCount; r++) {
        
        let brick = bricks.bricks[c][r];
        if (brick.status == 1) {
          if (this.dx > 0 && this.dy > 0) { //Проверка верхней и левой граней
            let pointLeftTop = new Point(brick.x, brick.y);
            let pointLeftBottom = new Point(brick.x, brick.y + brick.height);
            let pointTopLeft = new Point(brick.x, brick.y);
            let pointTopRight = new Point(brick.x + brick.width, brick.y);
            if (intersection(pointCenter, pointMoveToRightBottom, pointLeftBottom, pointLeftTop)) {
              this.dx = -this.dx;
              brick.checkDestroy();
              return "brick";
            }
            if (intersection(pointCenter, pointMoveToRightBottom, pointTopLeft, pointTopRight)) {
              this.dy = -this.dy;
              brick.checkDestroy();
              return "brick";
            }
          }
          else if (this.dx < 0 && this.dy < 0) { //Проверка нижней и правой граней
            let pointBottomLeft = new Point(brick.x - 1, brick.y + brick.height);
            let pointBottomRight = new Point(brick.x + brick.width + 1, brick.y + brick.height);
            let pointRightTop = new Point(brick.x + brick.width, brick.y);
            let pointRightBottom = new Point(brick.x + brick.width, brick.y + brick.height);
            if (intersection(pointCenter, pointMoveToLeftTop, pointBottomRight, pointBottomLeft)) {
              this.dy = -this.dy;
              brick.checkDestroy();
              return "brick";
            }
            if (intersection(pointCenter, pointMoveToLeftTop, pointRightBottom, pointRightTop)) {
              this.dx = -this.dx;
              brick.checkDestroy();
              return "brick";
            }
          }
          else if (this.dx > 0 && this.dy < 0) { //Проверка нижней и левой граней
            let pointBottomLeft = new Point(brick.x, brick.y + brick.height);
            let pointBottomRight = new Point(brick.x + brick.width, brick.y + brick.height);
            let pointLeftTop = new Point(brick.x, brick.y);
            let pointLeftBottom = new Point(brick.x, brick.y + brick.height);
            if (intersection(pointCenter, pointMoveToRightTop, pointLeftBottom, pointLeftTop)) {
              this.dx = -this.dx;
              brick.checkDestroy();
              return "brick";
            }
            if (intersection(pointCenter, pointMoveToRightTop, pointBottomLeft, pointBottomRight)) {
              this.dy = -this.dy;
              brick.checkDestroy();
              return "brick";
            }
          }
          else if (this.dx < 0 && this.dy > 0) { //Проверка верхней и правой граней
            let pointTopLeft = new Point(brick.x, brick.y);
            let pointTopRight = new Point(brick.x + brick.width, brick.y);
            let pointRightTop = new Point(brick.x + brick.width, brick.y);
            let pointRightBottom = new Point(brick.x + brick.width, brick.y + brick.height);
            if (intersection(pointCenter, pointMoveToLeftBottom, pointRightTop, pointRightBottom)) {
              this.dx = -this.dx;
              brick.checkDestroy();
              return "brick";
            }
            if (intersection(pointCenter, pointMoveToLeftBottom, pointTopRight, pointTopLeft)) {
              this.dy = -this.dy;
              brick.checkDestroy();
              return "brick";
            }
          }
        }
      }
    }
  }
}