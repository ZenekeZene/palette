const _ = require('lodash');
const drag = require('./drag');
const grid = require('./grid');
const color = require('./color');

let app;
let swatches, dropzones;
let swatchNodes, dropzoneNodes;
let activeColorObject;
let contSuccess;

let levelSuccessed, levelFailed, scoreToAument;

function checkSuccess(index) {
	if (_.isEqual(swatches[index].cmyk, dropzones[index].cmyk)) {
		swatches[index].el.classList.add('match-swatch');
		dropzones[index].el.classList.add('match-mixer');
		swatches[index].isEnabled = false;
		dropzones[index].isEnabled = false;
		return true;
	} else {
		return false;
	}
}

function updateActive(newActiveColorObject) {
	// Borramos el Activo viejo:
	app.removeChild(activeColorObject.el);
	activeColorObject = newActiveColorObject;
	app.append(activeColorObject.el);
	drag.setActiveNode(activeColorObject.el);
}

function doMix(dropzone, index) {
	let cmyk = color.addColors(dropzone.cmyk, activeColorObject.cmyk);
	// Actualizamos el Mix:
	dropzone.setCMYK(cmyk);
	// Hacemos el checkeo en los swatches en busca de una coincidencia con nuestro active + dropzone
	// Si hemos acertado:
	if (checkSuccess(index)) {
		contSuccess++;
		scoreToAument();
		if (contSuccess !== swatches.length) {
			dropzone.el.classList.add('disabled');
			// Seteamos un nuevo activo:
			let newActiveColorObject = createActiveObject();
			updateActive(newActiveColorObject);
		} else {
			app.removeChild(activeColorObject.el);
			activeColorObject = null;
			contSuccess = 0;
			levelSuccessed();
		}
	} else {
		const { dropzoneWasCorrect, swatchWasCorrect } = searchCorrectSwatchAndDropzone();
		app.removeChild(activeColorObject.el);
		activeColorObject = null;
		contSuccess = 0;
		levelFailed(dropzoneWasCorrect, swatchWasCorrect, swatches, dropzones);
	}
}

function searchCorrectSwatchAndDropzone() {
	let dropzoneWasCorrect, swatchWasCorrect;
	for (let i = 0; i < swatches.length; i++) {
		for (let j = 0; j < dropzones.length; j++) {
			let cmyk = color.addColors(activeColorObject.cmyk, dropzones[j].cmyk);
			if (_.isEqual(cmyk, swatches[i].cmyk)) {
				dropzoneWasCorrect = dropzones[j];
				swatchWasCorrect = swatches[i];
			}
		}
	}
	return {
		dropzoneWasCorrect,
		swatchWasCorrect,
	};
}

function getRandomEnabledItem() {
	const swatchActives = swatches.filter((swatch) => swatch.isEnabled === true);
	const sample = _.sample(swatchActives);
	return sample.index;
}

function createActiveObject() {
	const node = document.createElement('div');
	node.classList.add('active__swatch', 'swatch', 'drag-drop', 'active');

	const indexRandom = getRandomEnabledItem();

	return new color.ColorObject(
		color.subtractColors(swatches[indexRandom].cmyk, dropzones[indexRandom].cmyk),
		node
	);
}

function initSwatches(swatchesNodes) {
	let swatches = [];
	for (let i = 0; i < swatchesNodes.length; i++) {
		const swatch = new color.ColorObject(color.getColorCMYKRandom(), swatchesNodes[i]);
		swatch.index = i;
		swatches.push(swatch);
	}
	return swatches;
}

function initDropzones(dropzoneNodes) {
	const dropzones = [];
	for (let i = 0; i < dropzoneNodes.length; i++) {
		dropzones.push(
			new color.ColorObject(color.getColorRelationed(swatches[i].cmyk), dropzoneNodes[i])
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
	drag.init(activeColorObject.el, dropzones, doMix);
	app.append(activeColorObject.el);
}

function setup(appEntry, levelSuccessedEntry, levelFailedEntry, scoreToAumentEntry) {
	app = appEntry;
	levelSuccessed = levelSuccessedEntry;
	levelFailed = levelFailedEntry;
	scoreToAument = scoreToAumentEntry;
}

const API = {
	setup: setup,
	playLevel: playLevel,
};

module.exports = API;
