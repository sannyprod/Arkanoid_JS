//Модуль для проигрывания фоновой музыки и воспроизведения игровых звуков (Столкновение, поражение, победа, потеря жизни)
export class Sound {
  constructor(src, volume, endTime = Infinity, loop = false) {
    this.sound = document.createElement("audio");
    this.sound.src = src; //Ссылка на аудиофайл
    this.sound.setAttribute("preload", "auto"); //Для загрузки аудио сразу
    this.sound.setAttribute("controls", "none"); //Убираем панель управления
    this.sound.setAttribute("loop", String(loop)); //Зацикливание аудио
    this.sound.style.display = "none"; //Скрываем
    this.sound.volume = volume; //Установка текущего значения звука
    this.endTime = endTime; //Время, после которого воспроизведение надо прекратить, надо для звуков короче 1 секунты, например, столкновение
    this.isEnable = false; //Для запрета проигрывания звуков игры
    // this.isPlayed = false;

    this._addEventListeners();
  }

  set volume(value = 0) {
    this.sound.volume = value;
  }

  get volume(){
    return this.sound.volume;
  }

  set enable(value) {
    this.isEnable = value;
  }

  //Воспроизвести аудио, если не установлен запрет проигрывания
  play() {
    if (this.isEnable) {
      this.sound.currentTime = 0;
      this.sound.play();
    }
    // this.isPlayed = true;
  }

  //Остановить аудио
  stop() {
    this.sound.pause();
    // this.isPlayed = false;
  }

  //Обработчик для звуков короче 1 секунды, например, отскок
  _addEventListeners() {
    this.sound.addEventListener("timeupdate", (event) => {
      if (this.sound.currentTime > this.endTime) {
        this.sound.pause();
      }
    }, false);
  }
}