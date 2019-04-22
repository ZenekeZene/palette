import "./styles/styles.scss";
import "animate.css";
const game = require("./lib/game");
const persist = require("./lib/persist");

const app = document.getElementById("app");
const nextButton = document.getElementById("nextButton");
const replayButton = document.getElementById("replayButton");
const control = document.getElementById("control");
const numLevels = document.getElementById("numLevels");
const score = document.getElementById("score");

const levels = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let levelCurrent = 0;
let contSuccessTotal = 0;

function scoreToAument() {
  contSuccessTotal++;
  score.textContent = contSuccessTotal;
  persist.saveData("currentLevel", contSuccessTotal);
}

function levelSuccessed() {
  control.classList.add("fadeIn", "animated");
  control.classList.remove("hide");
  app.classList.add("fadeOut", "animated");
  nextButton.classList.remove("hide");
  nextButton.classList.add("fadeIn", "animated");
  replayButton.classList.add("hide");
  levelCurrent++;
}

function levelFailed() {
  control.classList.add("fadeIn", "animated");
  control.classList.remove("hide");
  app.classList.add("fadeOut", "animated");
  nextButton.classList.add("hide");
  replayButton.classList.remove("hide");
  replayButton.classList.add("fadeIn", "animated");
}

function handNextLevel() {
  numLevels.textContent = levelCurrent + 1;
  showLevel();
}

function showLevel() {
  game.playLevel(levels[levelCurrent]);
  control.classList.add("hide");
  app.classList.remove("fadeOut", "animated");
}

nextButton.addEventListener("click", handNextLevel);
replayButton.addEventListener("click", showLevel);

game.setup(app, levelSuccessed, levelFailed, scoreToAument);

levelCurrent = persist.getData("currentLevel") || 0;
numLevels.textContent = levelCurrent + 1;
game.playLevel(levels[levelCurrent]);
