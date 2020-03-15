import { Engine } from "./src/engine.js";


window.onload = () => {
  // document.getElementsByName("script").forEach(element => {
  //   document.removeChild(element);
  // });

  let engine = new Engine();
  engine.start();
}