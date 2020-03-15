import { Modal } from "./service/modal.js";

//Нижнее меню
export class Menu {
  constructor() {
    this.buttonsBlock = this._getCreateButtonsBlock();
    this.buttonsList = this._fillButtonsList();
    this._fillButtonsBlock();
    this.informationWindow = this._setupInformationWindow();
  }

  //Основной блок разметки в котором хранятся кнопки
  _getCreateButtonsBlock() {
    let buttonsBlock = document.getElementById("buttonsBlock");

    if (!buttonsBlock) {
      buttonsBlock = document.createElement("div");
      buttonsBlock.id = "buttonsBlock";
      buttonsBlock.classList.add("buttons_block");
      // document.body.appendChild(buttonsBlock);
    }

    return buttonsBlock;
  }

  //Создание модального окна с информацией
  _setupInformationWindow() {
    let informationHtmlPageSrc = "./custom-pages/information.html";
    let informationButton = this.getButton("information"); //Точка возле которой необходимо позиционировать модалку
    let informationWindow = new Modal("information", informationHtmlPageSrc, informationButton, "TOP", "RIGHT", -50, 0);

    informationWindow.useOnOutClickEvent = false; //Отключаем событие клика, т.к. окно должно появляться только при наведении
    informationWindow.opacity = 1; //Прозрачность
    informationWindow.height = 200;

    return informationWindow;
  }

  //Заполнение списка html кнопок
  _fillButtonsList() {
    let buttonsList = [];

    this._getButtonsPropsList().forEach(function (item, i, arr) {
      buttonsList.push({ 
        name: item.id,
        value: this._createButton(item) 
      });
    }, this);

    return buttonsList;
  }

  //Список кнопок которые необходимо создать
  _getButtonsPropsList() {
    let list = [{ id: "information",  text: "?",      classes: ["information_button"],         eventListeners: ["mouseover", "mouseout"] },
                { id: "start",        text: "Start",  classes: ["start_button"],               eventListeners: ["click"] },
                { id: "sound",        text: "Sound",  classes: ["sound_button", "off"],        eventListeners: ["click"] },
                { id: "music",        text: "Music",  classes: ["music_button", "off"],        eventListeners: ["click"] },
                { id: "settings",     text: "⚙",     classes: ["settings_button", "disable"], eventListeners: ["click"] }];
    return list;
  }

  //Создание html элемента кнопки
  _createButton(item) {
    let button = document.createElement("button");

    button.id = item.id;
    button.textContent = item.text;
    button.classList.add("menu_button");
    
    item.classes.forEach(element => {
      button.classList.add(element);
      });

    item.eventListeners.forEach(event => {
      button.addEventListener(event, this);
    });

    return button;
  }

  //Смена состояния кнопки настроек
  changeSettingsButtonState(isActive) {
    let btn = this.getButton("settings");
    if (isActive) {
      btn.classList.add("enable");
      btn.classList.remove("disable");
    }
    else {
      btn.classList.add("disable");
      btn.classList.remove("enable");
    }
  }

  //Смена состояния кнопки Start/Stop
  changeStartStop(gameIsStarted) {
    let button = this.getButton("start");
    button.classList.toggle("isStarted");
    button.textContent = gameIsStarted ? "Stop" : "Start";
  }

  //Получить кнопку из массива html кнопок
  getButton(name) {
    return this.buttonsList.find(button => button.name === name).value;
  }

  //Добавление каждой кнопки в основной блок с кнопками
  _fillButtonsBlock() {
    this.buttonsList.forEach((item, i, arr) => {
      this.buttonsBlock.appendChild(item.value);
    });
  }

  //Добавление меню к основному элементу интерфейса
  show(mainBlock) {
    mainBlock.appendChild(this.buttonsBlock);
  }

  //region Events
  //Общий обработчик событий
  handleEvent(event) {
    let method = '_on' + event.type[0].toUpperCase() + event.type.slice(1);
    this[method](event);
  }

  //Обработка событий клика по каждой кнопке меню
  _onClick(event) {
    if (event.target.id === "settings") {
      let settingsEvent = new Event("settings");
      document.dispatchEvent(settingsEvent);
    }
    else if (event.target.id === "start") {
      let startEvent = new Event("start");
      document.dispatchEvent(startEvent);
    }
    else if (event.target.id === "sound") {
      let soundEvent = new Event("sound");
      document.dispatchEvent(soundEvent);
      event.target.classList.toggle("off");
    }
    else if (event.target.id === "music") {
      let musicEvent = new Event("music");
      document.dispatchEvent(musicEvent);
      event.target.classList.toggle("off");
    }
  }

  //При наведении на информационную кнопку показать модальное окно с информацией
  _onMouseover(event) {
    this.informationWindow.show();
  }

  //Скрыть модальное окно с информацией, когда курсор не на кнопку
  _onMouseout(event) {
    this.informationWindow.hide();
  }
  //endregion
}