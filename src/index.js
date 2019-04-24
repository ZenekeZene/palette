/* TODO:
- [x] Colores casi blancos
- [x] Colores muy parecidos
- [x] Bajar a local
- Persistir record
- Cambiar el grid por el flex
- [x] Dar feedback del error
- Explicativo al principio
- Música ambient / chill / Mobi
- Recompensa visual entre niveles (¿Quotes de artistas?)
*/

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
let levelCurrent = parseInt(persist.getData("levelCurrent"), 10) || 0;
let contSuccessTotal = persist.getData("contSuccessTotal") || 0;

function scoreToAument() {
  contSuccessTotal++;
  score.textContent = contSuccessTotal;
  persist.saveData("contSuccessTotal", contSuccessTotal);
}

function levelSuccessed() {
  control.classList.add("fadeIn", "animated");
  control.classList.remove("hide");
  app.classList.add("fadeOut", "animated");
  nextButton.classList.remove("hide");
  nextButton.classList.add("fadeIn", "animated");
  replayButton.classList.add("hide");
  levelCurrent++;
  persist.saveData("levelCurrent", levelCurrent);
}

function levelFailed(dropzoneWasCorrect,swatchWasCorrect,swatches,dropzones) {
  dropzoneWasCorrect.nodeElement.classList.add("wasCorrect");
  swatchWasCorrect.nodeElement.classList.add("wasCorrect");
  const swatchesNotCorrect = swatches.filter(
    swatch => !swatch.nodeElement.classList.contains("wasCorrect")
  );
  for (let i = 0; i < swatchesNotCorrect.length; i++) {
    swatchesNotCorrect[i].nodeElement.classList.add("match-swatch");
  }
  const dropzonesNotCorrect = dropzones.filter(
    dropzone => !dropzone.nodeElement.classList.contains("wasCorrect")
  );
  for (let i = 0; i < dropzonesNotCorrect.length; i++) {
    dropzonesNotCorrect[i].nodeElement.classList.add("match-swatch");
  }
  setTimeout(() => {
    control.classList.add("fadeIn", "animated");
    control.classList.remove("hide");
    app.classList.add("fadeOut", "animated");
    nextButton.classList.add("hide");
    replayButton.classList.remove("hide");
    replayButton.classList.add("fadeIn", "animated");
  }, 700);
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

numLevels.textContent = levelCurrent + 1;

score.textContent = contSuccessTotal;
game.playLevel(levels[levelCurrent]);
