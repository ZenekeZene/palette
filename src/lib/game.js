const _ = require("lodash");
const drag = require("./drag");
const grid = require("./grid");
const color = require("./color");

let app;
let swatches, dropzones;
let swatchNodes, dropzoneNodes;
let activeColorObject;
let contSuccess;

let levelSuccessed, levelFailed, scoreToAument;

function checkSuccess(index) {
  if (_.isEqual(swatches[index].cmyk, dropzones[index].cmyk)) {
    swatches[index].nodeElement.classList.add("match-swatch");
    dropzones[index].nodeElement.classList.add("match-mixer");
    swatches[index].isEnabled = false;
    dropzones[index].isEnabled = false;
    return true;
  } else {
    return false;
  }
}

function updateActive(newActiveColorObject) {
  // Borramos el Activo viejo:
  app.removeChild(activeColorObject.nodeElement);
  activeColorObject = newActiveColorObject;
  app.append(activeColorObject.nodeElement);
  drag.setActiveNode(activeColorObject.nodeElement);
}

function doMix(dropzone, index) {
  let cmyk = color.addColors(dropzone.cmyk, activeColorObject.cmyk);
  // Actualizamos el Mix:
  dropzone.setCMYK(cmyk);
  // Hacemos el checkeo en los swatches en busca de una coincidencia con nuestro
  // Si hemos acertado:
  if (checkSuccess(index)) {
    contSuccess++;
    scoreToAument();
    if (contSuccess !== swatches.length) {
      dropzone.nodeElement.classList.add("disabled");
      // Seteamos un nuevo activo:
      let newActiveColorObject = createActiveObject();
      updateActive(newActiveColorObject);
    } else {
      app.removeChild(activeColorObject.nodeElement);
      activeColorObject = null;
      contSuccess = 0;
      levelSuccessed();
    }
  } else {
    app.removeChild(activeColorObject.nodeElement);
    activeColorObject = null;
    contSuccess = 0;
    levelFailed();
  }
}

function getRandomEnabledItem() {
  const swatchActives = swatches.filter(swatch => swatch.isEnabled === true);
  const sample = _.sample(swatchActives);
  //console.log(sample.index);
  return sample.index;
}

function createActiveObject() {
  const node = document.createElement("div");
  node.classList.add("plactive__swatch", "swatch", "drag-drop", "active");

  const indexRandom = getRandomEnabledItem();

  return new color.ColorObject(
    color.subtractColors(
      swatches[indexRandom].cmyk,
      dropzones[indexRandom].cmyk
    ),
    node
  );
}

function initSwatches(swatchesNodes) {
  let swatches = [];
  for (let i = 0; i < swatchesNodes.length; i++) {
    const swatch = new color.ColorObject(
      color.getColorCMYKRandom(),
      swatchesNodes[i]
    );
    swatch.index = i;
    swatches.push(swatch);
  }
  return swatches;
}

function initDropzones(dropzoneNodes) {
  const dropzones = [];
  for (let i = 0; i < dropzoneNodes.length; i++) {
    dropzones.push(
      new color.ColorObject(
        color.getColorRelationed(swatches[i].cmyk),
        dropzoneNodes[i]
      )
    );
  }
  return dropzones;
}

function playLevel(numRows, numCols) {
  contSuccess = 0;
  // Draw grid:
  ({ swatchNodes, dropzoneNodes } = grid.init(numRows, numCols));

  // Init Swatches, Dropzones and Active
  swatches = initSwatches(swatchNodes);
  dropzones = initDropzones(dropzoneNodes);
  activeColorObject = createActiveObject();
  drag.init(activeColorObject.nodeElement, dropzones, doMix);
  app.append(activeColorObject.nodeElement);
}

function setup(
  appEntry,
  levelSuccessedEntry,
  levelFailedEntry,
  scoreToAumentEntry
) {
  app = appEntry;
  levelSuccessed = levelSuccessedEntry;
  levelFailed = levelFailedEntry;
  scoreToAument = scoreToAumentEntry;
}

const API = {
  setup: setup,
  playLevel: playLevel
};

module.exports = API;
