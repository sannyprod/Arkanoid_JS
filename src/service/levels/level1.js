import { Level } from "../level.js";

//3x6
let level1 = new Level(3, 6, [
  [ {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},//левый верхний угол
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1}],//левый нижний угол
  [ {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 2},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},],
  [ {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1}],
  [ {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1}],
  [ {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 2},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1}],
  [ {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},//Правый верхний угол
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1},
    {x: null, y: null, width: null, height: null, status: 1, bumpsToDestroy: 1}]]);//Правый нижний угол

export { level1 }