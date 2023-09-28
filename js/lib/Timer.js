class Timer {
  /**
   * @param {function} handler
   * @param {function} callback
   * @param {number} seconds
   */
  constructor(seconds, handler, callback) {
    this.isRunning = false;
    this.timerId;
    this.offset = 0;
    this.current = 0;
    this.seconds = seconds;
    this.handler = handler;
    this.callback = callback;
  }

  start() {
    this.isRunning = true;
    setTimeout(() => {
      this.timerId = setInterval(() => {
        this.current = Date.now();
        this.seconds--;
        this.callback(this.seconds);

        if (this.seconds == 0) {
          this.offset = 0;
          clearInterval(this.timerId);
          this.handler();
        }
      }, 1000);
    }, this.offset);
  }

  pause() {
    this.offset = Date.now();
    this.isRunning = false;

    clearInterval(this.timerId);
  }

  static formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

export { Timer };
