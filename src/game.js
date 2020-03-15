import { Sound } from "./service/sound.js";
import { Modal } from "./service/modal.js";
import { Ball } from "./figures/ball.js";
import { Paddle } from "./figures/paddle.js";
import { Bricks } from "./figures/bricks.js";
import { levels } from "./service/levels.js";


export class Game {
  constructor(soundVolume = 1) {
    this.isStarted = false;
    this.isPaused = false;

    this.interval = null;

    this.leftKeyCode = ["a", "ф", "ArrowLeft"];
    this.rightKeyCode = ["d", "в", "ArrowRight"];

    this.leftPressed = false;
    this.rightPressed = false;

    this.loseModal = this._setupLoseWindow();
    this.winModal = this._setupWinWindow();
    this.levelModal = this._setupLevelWindow();

    this.heart = this._loadHeartImage();

    this.soundsList = this._fillSoundsList(soundVolume);

    this.canvas = this._createCanvas();
    this.ctx = this.canvas.getContext("2d");

    this.score = 0;
    this.localScore = 0;
    this.lives = 3;
    this.levelWindowTimeDelay = 50;
    this.levels = levels;
    this.currentLevel = 0;

    this.paddle = new Paddle(this.canvas);
    this.ball = new Ball(this.canvas);
    this.bricks = this._createCurrentLevelBricks();
  }

  _createCanvas() {
    let canvas = document.createElement("canvas");

    canvas.id = "gameCanvas";
    canvas.classList.add("isStoped");
    canvas.width = 660;
    canvas.height = 510;

    return canvas;
  }

  _createCurrentLevelBricks() {
    return new Bricks(this.canvas, this.levels[this.currentLevel]);
  }

  _setupLoseWindow() {
    let loseHtmlPageSrc = "./custom-pages/lose.html";
    let loseWindow = new Modal("lose", loseHtmlPageSrc);

    loseWindow.opacity = 0.7;

    return loseWindow;
  }

  _setupWinWindow() {
    let winHtmlPageSrc = "./custom-pages/win.html";
    let winWindow = new Modal("win", winHtmlPageSrc);

    winWindow.opacity = 0.7;

    return winWindow;
  }

  _setupLevelWindow() {
    let levelHtmlPageSrc = "./custom-pages/level.html";
    let levelWindow = new Modal("level", levelHtmlPageSrc);
    levelWindow.useOnOutClickEvent = false;

    levelWindow.opacity = 0.65;

    return levelWindow;
  }

  _loadHeartImage() {
    let heart = new Image();

    heart.src = "./resources/heart.png";

    return heart;
  }

  _fillSoundsList(soundVolume) {
    let soundsList = [
      {name: "bounce", res: new Sound("./resources/bounce.wav", soundVolume, 0.3)},
      {name: "lifeLose", res: new Sound("./resources/lifeLost.wav", soundVolume, 1)}
    ];

    return soundsList;
  }

  getSound(name) {
    return this.soundsList.find(button => button.name === name).res;
  }

  changeSoundStatus(isEnable) {
    this.soundsList.forEach(element => {
      element.res.enable = isEnable;
    });
  }

  set soundVolume(value) {
    this.soundsList.forEach(element => {
      element.res.volume = value;
    });
  }

  show(mainElement) {
    mainElement.appendChild(this.canvas);
  }

  start() {
    if (!this.isStarted) {
      this._start();
    }
    else {
      this._stop();
    }
    this.isStarted = !this.isStarted;
  }

  get started() {
    return this.isStarted;
  }

  _start() {
    this._addEventsListeners();
    this._setInterval(16);
  }

  _stop() {
    this._removeEventListeners();
    clearInterval(this.interval);
    this._reset(true, true);
  }

  _reset(restart = false, resetTimeDelay = false) {
    this.ball.reset(this.canvas);
    this.paddle.reset(this.canvas);

    if (resetTimeDelay) {
      this.levelModal.hide();
      this.levelWindowTimeDelay = 50;
    }

    if (restart) {
      this.lives = 3;
      this.score = 0;
      this.localScore = 0;
      this.isPaused = false;
      this.leftPressed = false;
      this.rightPressed = false;
      this.currentLevel = 0;
      this._setLevel(this.currentLevel);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    else {
      this._drawFigures();
    }
  }

  _setInterval() {
    this.interval = setInterval(() => {
      this._tickGameLogic();
    }, 16);
  }

  _pause() {
    if (this.isPaused) {
      this._setInterval();
    }
    else {
      clearInterval(this.interval);
      this._drawPaused();
    }
  }

  _tickGameLogic() {
    if (this.levelWindowTimeDelay !== 0) {
      this.levelModal.show({level: this.currentLevel + 1});
      this.levelWindowTimeDelay -= 1;
    }
    else {
      this.levelModal.hide();
      this._moveFigures();
      this._checkWinLose();
    }
    if (this.isStarted) {
      this._drawFigures();
    }
  }

  _checkWinLose() {
    if (this.lives === 0) {
      this._handleLose();
    }
    else if (this.localScore === this.bricks.bumpsToWin) {
      this._handleLevelFinishing();
    }
  }

  _handleLose() {
    let params = {Score: this.score};
    this.loseModal.show(params);
    document.dispatchEvent(new Event("start"));
  }

  _handleLevelFinishing() {
    //Уровень пройден
    this.localScore = 0;
    this._reset(false, true);
    this.levelWindowTimeDelay = 50;
    if (this.currentLevel === this.levels.length-1) { //Если прошли последний уровень
      this.winModal.show();
      document.dispatchEvent(new Event("start"));
    }
    else {
      this.currentLevel += 1;
      this._setLevel(this.currentLevel);
    }
  }

  _setLevel(value) {
    this.bricks = new Bricks(this.canvas, this.levels[value]);
  }

  _drawFigures() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
    this.bricks.draw(this.ctx);

    this._drawLives();
    this._drawScore();
  }

  _drawPaused() {
    this.ctx.font = "bold 46px Arial";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText("Paused" , this.canvas.width / 2 - 80, this.canvas.height / 2 + 25);
  }

  _drawLives() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText("Lives: ", 20, 16);
    this._drawHearts();
  }

  _drawHearts() {
    for (let i = 0; i < this.lives; i++) {
      this.ctx.drawImage(this.heart, 65 + i*20, 4, 15, 15);
    }
  }

  _drawScore() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#fff";
    if (String(this.score).length == 1) {
      this.ctx.fillText("Score: " + this.score, this.canvas.width - 80, 17);
    }
    else {
      this.ctx.fillText("Score: " + this.score, this.canvas.width - 88, 17);
    }
  }

  _moveFigures() {
    this.ball.move(this.canvas, this.paddle, this.bricks);
    this.paddle.move(this.canvas, this.leftPressed, this.rightPressed);
  }

  //region Events
  _addEventsListeners() {
    document.addEventListener("keydown", this);
    document.addEventListener("keyup", this);
    document.addEventListener("bounce", this);
    document.addEventListener("brick", this);
    document.addEventListener("lifeLose", this);
  }

  _removeEventListeners() {
    document.removeEventListener("keydown", this);
    document.removeEventListener("keyup", this);
    document.removeEventListener("bounce", this);
    document.removeEventListener("brick", this);
    document.removeEventListener("lifeLose", this);
  }

  handleEvent(event) {
    let method = "_" + event.type;
    this[method](event);
  }

  _bounce(event) {
    let sound = this.getSound(event.type);
    sound.play();
  }

  _lifeLose(event) {
    let sound = this.getSound(event.type);
    sound.play();
    this.lives--;
    this._reset(false);
  }

  _brick(event) {
    let sound = this.getSound("bounce");
    sound.play();
    this.score++;
    this.localScore++;
  }

  _keydown(event) {
    if (this.leftKeyCode.includes(event.key)) {
      this.leftPressed = true;
    }
    if (this.rightKeyCode.includes(event.key)) {
      this.rightPressed = true;
    }

    if (event.type == "keydown" && (event.key.toUpperCase() == "P" || event.key.toUpperCase() == "З")) {
      this._pause();
      this.isPaused = !this.isPaused;
    }
  }

  _keyup(event) {
    if (this.leftKeyCode.includes(event.key)) {
      this.leftPressed = false;
    }
    if (this.rightKeyCode.includes(event.key)) {
      this.rightPressed = false;
    }
  }
  //endregion
}