//Родительский класс для фигур
export class Figure {
  constructor(x = 0, y = 0, color = "#666") {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}