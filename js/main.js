import { words } from "./constants/words.js";
import { Timer } from "./lib/Timer.js";

// #region Element Selectors

const container = document.getElementById("container");
const clock = document.getElementById("clock");
const word = document.getElementById("word");
const nextWord = document.getElementById("word-next");
const overlay = document.getElementById("overlay");
const wpmText = document.getElementById("wpm");
const input = document.getElementById("input");
const scoreDiv = document.getElementById("score");

// #endregion

container.addEventListener("click", () => {
  input.focus();

  overlay.classList.add("hidden");
});

container.addEventListener("keydown", onKeyDown);

const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

const validInput = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
  "Backspace",
];

const queue = [getRandomWord(), getRandomWord()];

let score;
let characters = 0;
let isRunning = false;
let isFinished = false;

const time = 60;
clock.textContent = Timer.formatTime(time);

const timer = new Timer(
  time,
  () => {
    clock.textContent = "Finished!";
    isRunning = false;
    isFinished = true;
    container.classList.add("pointer-events-none");
    input.disabled = true;
  },
  (seconds) => {
    clock.textContent = Timer.formatTime(seconds);
    const wpm = Math.round(((characters / 5) * 60) / (time - seconds));
    wpmText.textContent = wpm;
  }
);

input.addEventListener("focus", () => {
  if (isRunning) {
    timer.start();
  }
  overlay.classList.add("hidden");
});

input.addEventListener("blur", (event) => {
  if (isFinished || event.relatedTarget) {
    return;
  }
  overlay.classList.remove("hidden");
  timer.pause();
});

function initialize() {
  score = 0;
  scoreDiv.textContent = "0";
  setWords();
}

function setWords() {
  queue.shift();
  queue.push(getRandomWord());
  word.textContent = queue[0];
  word.classList.add("slide-up");
  setTimeout(() => word.classList.remove("slide-up"), 300);

  nextWord.textContent = queue[1];
}

function start() {
  isRunning = true;
  timer.start();
}

/**
 *
 * @param {Event} event
 */
function onKeyDown(event) {
  if (isFinished) return;

  if (!validInput.includes(event.key)) {
    event.preventDefault();
  }

  if (event.key == "Enter" || event.key == " ") {
    submitWord();
  }

  if (!isRunning) {
    start();
  }
}

function submitWord() {
  if (queue[0] == input.value) {
    score++;
    input.value = "";
    characters += queue[0].length;
    setWords();
  } else {
    container.classList.add("vibrate");
    setTimeout(() => container.classList.remove("vibrate"), 200);
  }

  scoreDiv.textContent = `${score}`;
}

initialize();
