const _ = require('lodash');
import { constants, mutations } from '../common';
import drag from './drag';
import grid from './grid';
import color from './color';
import ui from './ui';
import persist from '../tools/persist';
import spy from '../tools/spy';
import bonus from '../extras/bonus';

const statusObserver = constants.statusObserver;

// ONLY DEVELOPMENT:
let _isDev = false;

let baseActive,
	swatches,
	dropzones,
	swatchNodes,
	dropzoneNodes,
	activeColor,
	contSuccess,
	tutorialIsNotLaunched;

let	numItems = 0;

const limitActive = document.getElementById('limitActive');

function isSuccessfulMix(indexToCheck) {
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

function updateActive(newActiveColor) {
	limitActive.removeChild(activeColor.el);
	activeColor = newActiveColor;
	limitActive.append(activeColor.el);
	drag.setActiveNode(activeColor.el);
}

function doStep(dropzone, index, isFromBonus) {
	const colorMixed = mix(dropzone.cmyk, activeColor.cmyk);
	dropzone.setCMYK(colorMixed);

	if (isSuccessfulMix(index)) {
		contSuccess++;
		if (!isFromBonus) {
			statusObserver.notify('increaseScore');
			statusObserver.notify('stepSuccess', index);
		}
		if (contSuccess !== swatches.length) {
			handSuccessfulMix(dropzone, isFromBonus);
		} else {
			handGameFinished();
		}
	} else {
		handFailedMix();
	}
}

function mix(color1, color2) {
	return color.addColors(color1, color2);
}

function launchTutorial() {
	for (let i = 0; i < dropzones.length; i++) {
		dropzones[i].el.classList.remove('tutorial');
		baseActive.classList.remove('tutorial');
	}
	tutorialIsNotLaunched = false;
	persist.saveData('tutorialIsNotLaunched', false);
}

function handSuccessfulMix(dropzone) {
	dropzone.el.classList.add('disabled');
	updateActive(createActive());
	if (_isDev) {
		spy._giveMeTheSolution(numItems, swatches, dropzones, activeColor);
	}
}

function handFailedMix() {
	const { dropzoneWasCorrect, swatchWasCorrect } = searchCorrectSwatchAndDropzone();
	limitActive.removeChild(activeColor.el);
	activeColor = null;
	contSuccess = 0;
	statusObserver.notify('failedLevel'); 
	dropzoneWasCorrect.el.classList.add('wasCorrect');
	swatchWasCorrect.el.classList.add('wasCorrect');
	const swatchesNotCorrect = swatches.filter(
		(swatch) => !swatch.el.classList.contains('wasCorrect')
	);
	for (let i = 0; i < swatchesNotCorrect.length; i++) {
		swatchesNotCorrect[i].el.classList.add('reset-swatch');
	}
	const dropzonesNotCorrect = dropzones.filter(
		(dropzone) => !dropzone.el.classList.contains('wasCorrect')
	);
	for (let i = 0; i < dropzonesNotCorrect.length; i++) {
		dropzonesNotCorrect[i].el.classList.add('reset-swatch');
	}
}

function handGameFinished() {
	limitActive.removeChild(activeColor.el);
	activeColor = null;
	contSuccess = 0;
	statusObserver.notify('successfulLevel');
}

function searchCorrectSwatchAndDropzone() {
	let dropzoneWasCorrect, swatchWasCorrect;
	for (let i = 0; i < swatches.length; i++) {
		for (let j = 0; j < dropzones.length; j++) {
			let cmyk = color.addColors(activeColor.cmyk, dropzones[j].cmyk);
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

function createActive() {
	const node = document.createElement('div');
	node.classList.add('active__swatch', 'swatch', 'drag-drop', 'active');

	const indexRandom = getRandomEnabledItem();
	const cmyk = color.subtractColors(swatches[indexRandom].cmyk, dropzones[indexRandom].cmyk);
	appendBeatNodeToActiveNode(node, cmyk);

	return new color.ColorObject(
		cmyk,
		node,
	);
}

function appendBeatNodeToActiveNode(node, cmyk) {
	const beatNode = document.createElement('span');
	beatNode.classList.add('active__beat');
	node.append(beatNode);
	beatNode.style.backgroundColor = color.getRGBColor(color.convertCMYKtoRGB(cmyk));
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

function dropSuccessful(data) {
	const {dropZoneCurrent, index } = data[0];
	if (tutorialIsNotLaunched) {
		launchTutorial();
	}
	doStep(dropZoneCurrent, index, false);
}

function dropFailed() {
	if (tutorialIsNotLaunched) {
		for (let i = 0; i < dropzones.length; i++) {
			dropzones[i].el.classList.remove('tutorial');
			baseActive.classList.add('tutorial');
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
			new color.ColorObject(color.getColorRelated(swatches[i].cmyk), dropzoneNodes[i])
		);
	}
	return dropzones;
}

function playLevel() {
	contSuccess = 0;
	numItems =  constants.levels[mutations.getLevel()];
	({swatchNodes, dropzoneNodes} = grid.init(numItems));

	// Init Swatches, Dropzones and Active
	swatches = initSwatches(swatchNodes);
	dropzones = initDropzones(dropzoneNodes);
	activeColor = createActive();
	baseActive = document.getElementById('activeBase');
	tutorialIsNotLaunched = persist.getData('tutorialIsNotLaunched') !== 'false';
	if (tutorialIsNotLaunched === true) {
		baseActive.classList.add('tutorial');
	}
	drag.init(activeColor.el, dropzones, statusObserver, activeIsMoved);
	limitActive.append(activeColor.el);
	
	if (_isDev) {
		document.getElementById('app').classList.add('--is-dev');
		spy._giveMeTheSolution(numItems, swatches, dropzones, activeColor);
	} else {
		document.getElementById('app').classList.remove('--is-dev');
	}
}

function cleanLevel() {
	setTimeout(function() {
		grid.cleanAll();
		if (activeColor && limitActive) {
			limitActive.removeChild(activeColor.el);
		}
		activeColor = null;
	}, 1000);
}

function showCombo(index) {
	dropzones[index[0]].el.classList.add('combo');
}

function bonusUsed() {
	const index = spy._giveMeTheSolution(numItems, swatches, dropzones, activeColor);
	doStep(dropzones[index], index, true);
	statusObserver.notify('stepSuccessBonus');
}

function execAction(action, data) {
	const actions = {
		playLevel,
		cleanLevel,
		dropSuccessful,
		dropFailed,
		activeIsMoved,
		bonusUsed,
		showCombo,
	};
	if (actions[action]) {
		if (data) {
			return actions[action](data);
		} else {
			return actions[action]();
		}
	}
}

function init() {;
	statusObserver.subscribe(function(status, data) {
		execAction(status, data);
	});
	ui.init(statusObserver);
	bonus.init(statusObserver);
}

export default {
	init,
	playLevel,
};
