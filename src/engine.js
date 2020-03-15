import { Menu } from "./menu.js";
import { Game } from "./game.js";

import { Sound } from "./service/sound.js";
import { Modal } from "./service/modal.js";


export class Engine {
  constructor() {
    this.musicEnable = false;
    this.soundEnable = false;
    this.musicVolume = this._getMusicVolumeFromLocalStorage();
    this.soundVolume = this._setSoundVolumeFromLocalStorage();

    this.mainBlock = this._getCreateMainBlock();

    this.menu = new Menu();

    this.settingsModal = new Modal("settings", "./custom-pages/settings.html", this.menu.getButton("settings"), "top", "left", 50, 0);
    this.settingsModal.useOnOutClickEvent = false;
    this.settingsModal.opacity = 0.9;

    this.music = new Sound("./resources/background-music.mp3", this.musicVolume);

    this.game = new Game(this.soundVolume);
  }

  _getCreateMainBlock() {
    let mainBlock = document.getElementById("buttonsBlock");

    if (!mainBlock) {
      mainBlock = document.createElement("div");
      mainBlock.id = "mainBlock";
      mainBlock.classList.add("main_block");
      document.body.appendChild(mainBlock);
    }

    return mainBlock;
  }

  _setMusicVolumeToLovalStorage() {
    localStorage.setItem("musicVolume", this.musicVolume);
  }

  _setSoundVolumeToLocalStorage() {
    localStorage.setItem("soundVolume", this.soundVolume);
  }

  _getMusicVolumeFromLocalStorage() {
    let mVolume = localStorage.getItem("musicVolume");
    if (!mVolume) {
      return 1;
    }
    else {
      return Number(mVolume);
    }
  }

  _setSoundVolumeFromLocalStorage() {
    let sVolume = localStorage.getItem("soundVolume");
    if (!sVolume) {
      return 1;
    }
    else {
      return Number(sVolume);
    }
  }

  start() {
    this._addEventsListeners();
    this.menu.show(this.mainBlock);
    this.game.show(this.mainBlock);
  }

  //region Events
  _addEventsListeners() {
    document.addEventListener("start", this);
    document.addEventListener("sound", this);
    document.addEventListener("music", this);
    document.addEventListener("settings", this);

    document.addEventListener("changeMusicVolume", this);
    document.addEventListener("changeSoundVolume", this);
  }

  handleEvent(event) {
    let method = "_" + event.type;
    this[method](event);
  }

  //on Start button click - start Game
  _start(event) {
    this.game.start();
    this.menu.changeStartStop(this.game.started);
  }

  _sound(event) {
    this.soundEnable = !this.soundEnable;
    this.game.changeSoundStatus(this.soundEnable);
  }

  _music(event) {
    this.musicEnable = !this.musicEnable;
    this.music.enable = this.musicEnable;
    if (this.musicEnable) {
      this.music.play();
    }
    else {
      this.music.stop();
    }
  }

  _settings(event) {
    if (this.settingsModal.visible) {
      this.settingsModal.hide();
    }
    else {
      let params = {mVolume: this.musicVolume, sVolume: this.soundVolume};
      this.settingsModal.show(params);
    }
    this.menu.changeSettingsButtonState(this.settingsModal.visible);
  }

  _changeMusicVolume(event) {
    this.musicVolume = event.detail.value;
    this.music.volume = this.musicVolume;
    this._setMusicVolumeToLovalStorage();
  }

  _changeSoundVolume(event) {
    this.soundVolume = event.detail.value;
    this.game.soundVolume = this.soundVolume;
    this._setSoundVolumeToLocalStorage();
  }
  //endregion
}