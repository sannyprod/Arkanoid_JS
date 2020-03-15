//Проверка наличия точки пересечения двух отрезков
//Например, от центра круга до точки в которую попадет на следующем шаге и одной из граней платформы
//Рэйкаст?
export function intersection(p1, p2, p3, p4) {

  if (p2.x < p1.x) {
    let tmp = p1;
    p1 = p2;
    p2 = tmp;
  }
 
  if (p4.x < p3.x) {
    let tmp = p3;
    p3 = p4;
    p4 = tmp;
  }

  if (p2.x < p3.x) {
    return false;
  }

  if((p1.x - p2.x == 0) && (p3.x - p4.x == 0)) {
    if(p1.x == p3.x) {
      if (!((Math.max(p1.y, p2.y) < Math.min(p3.y, p4.y)) ||
            (Math.min(p1.y, p2.y) > Math.max(p3.y, p4.y)))) {
        return true;
      }
    }
    return false;
  }

  if (p1.x - p2.x == 0) {
    let Xa = p1.x;
    let A2 = (p3.y - p4.y) / (p3.x - p4.x);
    let b2 = p3.y - A2 * p3.x;
    let Ya = A2 * Xa + b2;

    if (p3.x <= Xa && p4.x >= Xa && Math.min(p1.y, p2.y) <= Ya &&
        Math.max(p1.y, p2.y) >= Ya) {

      return true;
    }
    return false;
  }

  if (p3.x - p4.x == 0) {
    let Xa = p3.x;
    let A1 = (p1.y - p2.y) / (p1.x - p2.x);
    let b1 = p1.y - A1 * p1.x;
    let Ya = A1 * Xa + b1;

    if (p1.x <= Xa && p2.x >= Xa && Math.min(p3.y, p4.y) <= Ya &&
        Math.max(p3.y, p4.y) >= Ya) {
      return true;
    }
    return false;
  }

  let A1 = (p1.y - p2.y) / (p1.x - p2.x);
  let A2 = (p3.y - p4.y) / (p3.x - p4.x);
  let b1 = p1.y - A1 * p1.x;
  let b2 = p3.y - A2 * p3.x;

  if (A1 == A2) {
      return false;
  }
  let Xa = (b2 - b1) / (A1 - A2);
  if ((Xa < Math.max(p1.x, p3.x)) || (Xa > Math.min( p2.x, p4.x))) {
      return false;
  }
  else {
      return true;
  }
}