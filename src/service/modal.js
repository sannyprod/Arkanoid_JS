//Модуль для создания модальных окон (информация, настройки, оповещение о победе/поражении)
export class Modal {
  constructor(modalId = "modal",
              src = "",
              customPoint = null,
              verticalAlign = "TOP",
              horizontalAlign = "RIGHT",
              deltaX = 0,
              deltaY = 0) {
    this.mainElement = document.body; //Элемент в который будет добавляться окно
    this.modalBlock = this._createModalBlock(modalId); //Само модальное окно
    this.content = src; //Ссылка на html страницу разметки окна
    this.isVisible = false; //Для проверки открыто ли окно
    this.html = null; //Для заполнения переменных в html странице модалки

    this.customPoint = customPoint; //Если необходимо позиционирование окна относительно определенного элемента страницы, то задаем этот элемент <HTML>
    this.verticalAlign = verticalAlign; //Вертикальное выравнивание относительно элемента
    this.horizontalAlign = horizontalAlign; //Горизонтальное выравнивание относительно элемента
    this.deltaX = deltaX; //Сдвиг по горизонтали
    this.deltaY = deltaY; //Сдвиг по вертикали

    this.closeOnOutClick = true;//Только для окон, которые будут появляться программно(без нажатия на какую либо кнопку, например, при победе/поражении)
    // this.closeOnOutDblClick = false;

    this.isContentLoaded = false;
  }

  //Создание div элемента модального окна
  _createModalBlock(modalId) {
    let modalBlock = document.createElement("div");

    modalBlock.classList.add("modal");
    modalBlock.id = modalId + Math.round(Math.random() * 100);

    return modalBlock;
  }

  //Рассчет позиции окна
  _calculatePosition() {
    if (!this.customPoint) {
      this._calculateToCenter();
    }
    else {
      this._calculateToPoint();
    }
  }

  //Рассчет позиции модального окна относительно точки привязки
  _calculateToPoint() {
    let pointCoords = this.customPoint.getBoundingClientRect();
    let modalCoords = this.modalBlock.getBoundingClientRect();

    this.modalBlock.style.margin = "0px";

    switch (this.verticalAlign.toUpperCase()) {
      case "TOP":
        this.modalBlock.style.top = pointCoords.top - modalCoords.height + this.deltaY + "px";
        break;

      case "BOTTOM":
        this.modalBlock.style.top = pointCoords.top + pointCoords.height + this.deltaY + "px";
        break;

      case "CENTER":
        this.modalBlock.style.top = pointCoords.top + pointCoords.height / 2 - modalCoords.height/2 + this.deltaY + "px";
        break;
    }

    switch (this.horizontalAlign.toUpperCase()) {
      case "RIGHT":
        this.modalBlock.style.left = pointCoords.right + this.deltaX + "px";
        break;

      case "LEFT":
        this.modalBlock.style.left = pointCoords.left - modalCoords.width + this.deltaX + "px";
        break;

      case "CENTER":
        this.modalBlock.style.left = pointCoords.right - modalCoords.width / 2 + this.deltaX + "px";
        break;
    }
  }

  //Если не указана точка привязки окна, то центрируем окно относительно основного элемента
  _calculateToCenter() {
    let mainBlock = document.getElementById("mainBlock");
    if (!mainBlock) {
      mainBlock = this.mainElement;
    }
    let pointCoords = mainBlock.getBoundingClientRect();
    let modalCoords = this.modalBlock.getBoundingClientRect();

    this.modalBlock.style.margin = 0;

    this.modalBlock.style.top = pointCoords.height / 2 - modalCoords.height / 2 + pointCoords.y + "px";
    this.modalBlock.style.left = pointCoords.width / 2 - modalCoords.width / 2 + pointCoords.x + "px";
  }

  //Только для окон, которые будут появляться программно(без нажатия на какую либо кнопку, например, при победе/поражении)
  _onClickEvent = (event) => {
    let isModalWindow = this._checkModalIdRecoursive(event.target);
    if (!isModalWindow) {
      this.hide(event);
    }
  }

  //На случай если надо будет сделать закрытие по кнопке внутри окна
  _onCloseEvent = (event) => {
    this.hide();
  }

  //Для сохранения положения окна
  _onResize = (event) => {
    this._calculatePosition();
  }

  //для outClick
  _checkModalIdRecoursive(currentNode) {
    if (currentNode.parentElement === null) {
      return false;
    }
    if (currentNode.id === this.modalBlock.id) {
      return true;
    }
    else {
      return this._checkModalIdRecoursive(currentNode.parentElement);
    }
  }

  //Установить прозрачность окна
  set opacity(value) {
    this.modalBlock.style.opacity = value;
  }

  //Установить ширину, по умолчанию ширина берется из стиля
  set width(value) {
    this.modalBlock.style.width = value + "px";
  }

  //Установить высоту, по умолчанию высота берется из стиля
  set height(value) {
    this.modalBlock.style.height = value + "px";
  }

  //value - ссылка на html страницу из которой будет подгружаться разметка модалки
  //например - "./custom-pages/information.html"
  set content(value) {
    if (!value) {
      return;
    }

    let http = new XMLHttpRequest();  
    if (http) {  
      http.open('get', value);
      http.onreadystatechange = () => {
        if(http.readyState == 4) {  
          this.html = http.responseText; //для использования параметров внутри окна
          this.isContentLoaded = true;
        }
      }
      http.send();
    }
  }

  set visible(value) {
    this.isVisible = value;
  }

  get visible() {
    return this.isVisible;
  }

  //Если в html разметке модального окна есть переменные, то для их замены надо вызвать эту процедуру с параметрами вида {key1: value1, key2: value2}
  //Параметры в разметке следует указывать в фигруных скобках "{}"
  _fillVariables(params) {
    let str = this.html;
    for (let key in params) {
      let regExp = new RegExp("{"+key+"}", 'g');
      str = str.replace(regExp, params[key]);
    }
    this.modalBlock.innerHTML = str;
  }

  //Только для окон, которые будут появляться программно(без нажатия на какую либо кнопку, например, при победе/поражении)
  set useOnOutClickEvent(value) {
    this.closeOnOutClick = value;
  }

  // set useOnOutDblClickEvent(value) {
  //   this.closeOnOutDblClick = value;
  // }

  //Отображение модального окна
  //Если в модальном окне есть параметры, например, громкость звука, то надо передать объект вида {key1: value1, key2: value2}
  show(params = {}) {
    if (!this.isContentLoaded) {
      return;
    }

    window.addEventListener("resize", this._onResize); //Добавляем прослушку события изменения размера окна для позиционирования положения окна
    this._fillVariables(params); //Заполняем параметры, если есть
    this.mainElement.appendChild(this.modalBlock); //Добавляем в DOM модальное окно
    this.modalBlock.style.display = "flex"; //Отображаем
    this.visible = true;
    this._calculatePosition(); //Рассчитываем позицию, надо делать после отображения, иначе значения окна при пересчете получаются нулевыми
    this.modalBlock.addEventListener("close", this._onCloseEvent); //На случай, если в окно добавлена кнопка по которой его надо закрыть
    if (this.closeOnOutClick) {
      document.addEventListener("click", this._onClickEvent); //Только для окон, которые будут появляться программно(без нажатия на какую либо кнопку, например, при победе/поражении)
    }

    // if (this.closeOnOutDblClick) {
    //   document.addEventListener("dblclick", this._onClickEvent);
    // }
  }

  hide() {
    if (!this.isContentLoaded || !this.isVisible) {
      return;
    }

    this.modalBlock.style.display = "none"; //Скрываем окно
    this.mainElement.removeChild(this.modalBlock); //Удаляем элемент из DOM
    this.visible = false;
    this.modalBlock.addEventListener("close", this._onCloseEvent); //Удаляем прослушку события
    if (this.closeOnOutClick) {
      document.removeEventListener("click", this._onClickEvent);//Удаляем прослушку события
    }

    // if (this.closeOnOutDblClick) {
    //   document.removeEventListener("dblclick", this._onClickEvent);
    // }
  }
}