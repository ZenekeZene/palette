const _ = require('lodash');
const drag = require('./drag');
const grid = require('./grid');
const color = require('./color');
const persist = require('./persist');
const control = require('./control');

let levels;

// ONLY DEVELOPMENT:
let _isDev = false;

let app,
	baseActive,
	swatches,
	dropzones,
	swatchNodes,
	dropzoneNodes,
	activeColorObject,
	contSuccess,
	statusObserver;
let tutorialIsNotLaunched;
	numItems = 0;

function checkSuccess(indexToCheck) {
	if (_.isEqual(swatches[indexToCheck].cmyk, dropzones[indexToCheck].cmyk)) {
		swatches[indexToCheck].el.classList.add('match-swatch');
		dropzones[indexToCheck].el.classList.add('match-mixer');
		swatches[indexToCheck].isEnabled = false;
		dropzones[indexToCheck].isEnabled = false;
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

function doFailed() {
	if (tutorialIsNotLaunched) {
		for (let i = 0; i < dropzones.length; i++) {
			dropzones[i].el.classList.remove('tutorial');
			baseActive.classList.add('tutorial');
		}
	}
}

function doSuccess(dropzone, index) {
	if (tutorialIsNotLaunched) {
		for (let i = 0; i < dropzones.length; i++) {
			dropzones[i].el.classList.remove('tutorial');
			baseActive.classList.remove('tutorial');
		}
		tutorialIsNotLaunched = false;
		persist.saveData('tutorialIsNotLaunched', false);
	}
	let cmyk = color.addColors(dropzone.cmyk, activeColorObject.cmyk);
	// Actualizamos el Mix:
	dropzone.setCMYK(cmyk);
	// Hacemos el checkeo en los swatches en busca de una coincidencia con nuestro active + dropzone
	// Si hemos acertado:
	if (checkSuccess(index)) {
		contSuccess++;
		if (contSuccess !== swatches.length) {
			dropzone.el.classList.add('disabled');
			// Seteamos un nuevo activo:
			let newActiveColorObject = createActiveObject();
			updateActive(newActiveColorObject);
			if (_isDev) {
				_giveMeTheSolution();
			}
		} else {
			app.removeChild(activeColorObject.el);
			activeColorObject = null;
			contSuccess = 0;
			statusObserver.notify('success', levelCurrent);
		}
	} else {
		const { dropzoneWasCorrect, swatchWasCorrect } = searchCorrectSwatchAndDropzone();
		app.removeChild(activeColorObject.el);
		activeColorObject = null;
		contSuccess = 0;
		statusObserver.notify('fail', { dropzoneWasCorrect, swatchWasCorrect, swatches, dropzones });
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
	const swatchActives = swatches.filter(function(swatch) {
		return swatch.isEnabled === true;
	});
	const sample = _.sample(swatchActives);
	return sample.index;
}

function createActiveObject() {
	statusObserver.notify('scoreToAument');
	const node = document.createElement('div');
	node.classList.add('active__swatch', 'swatch', 'drag-drop', 'active');

	const indexRandom = getRandomEnabledItem();

	return new color.ColorObject(
		color.subtractColors(swatches[indexRandom].cmyk, dropzones[indexRandom].cmyk),
		node
	);
}

function activeIsMoved() {
	if (dropzones[0].el.classList.contains('tutorial')) return;
	if (tutorialIsNotLaunched) {
		baseActive.classList.remove('tutorial');
		for (let i = 0; i < dropzones.length; i++) {
			dropzones[i].el.classList.add('tutorial');
		}
	}
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

function playLevel() {
	levelCurrent = persist.getData('levelCurrent');
	contSuccess = 0;
	numItems = levels[levelCurrent];
	// Draw grid:
	({ swatchNodes, dropzoneNodes } = grid.init(numItems));

	// Init Swatches, Dropzones and Active
	console.log(swatchNodes);
	swatches = initSwatches(swatchNodes);
	dropzones = initDropzones(dropzoneNodes);
	activeColorObject = createActiveObject();
	baseActive = document.getElementById('activeBase');
	tutorialIsNotLaunched = persist.getData('tutorialIsNotLaunched') !== 'false';
	if (tutorialIsNotLaunched === true) {
		baseActive.classList.add('tutorial');
	}
	drag.init(activeColorObject.el, dropzones, statusObserver, activeIsMoved);
	app.append(activeColorObject.el);
	if (_isDev) {
		_giveMeTheSolution();
	}
}

function _giveMeTheSolution() {
	for(let i = 0; i < numItems; i++) {
		swatches[i].el.style.border = "none";
		dropzones[i].el.style.border = "none";
	}
	for(let i = 0; i < numItems; i++) {
		const pos = new color.ColorObject(
			color.addColors(dropzones[i].cmyk, activeColorObject.cmyk),
			null);
		if (_.isEqual(swatches[i].cmyk, pos.cmyk)) {
			swatches[i].el.style.border = "2px solid green";
			dropzones[i].el.style.border = "2px solid green";
			console.log('Aciertas con: ' + i);
			break;
		}
	}
}

function setup(appEntry, statusObserverEntry, levelsEntry) {
	app = appEntry;
	statusObserver = statusObserverEntry;
	levels = levelsEntry;
	statusObserver.subscribe(function(status, data) {
		switch(status) {
			case 'playLevel': playLevel(); break;
			case 'dropSuccess':
				const {dropZoneCurrent, index } = data[0];
				doSuccess(dropZoneCurrent, index); break;
			case 'dropFail': doFailed(); break;
			case 'activeIsMoved': activeIsMoved(); break;
		}
	});
	control.init(statusObserverEntry);
}

module.exports = {
	setup,
	playLevel,
};
