const persist = require('./persist');

let levelCurrent = parseInt(persist.getData('levelCurrent'), 10) || 0;

function levelSuccessed() {
	levelCurrent += 1;
	persist.saveData('levelCurrent', levelCurrent);
}

function levelFailed(data) {
	let {dropzoneWasCorrect, swatchWasCorrect, swatches, dropzones} = data[0];
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

function init(statusObserverEntry) {
	statusObserverEntry.subscribe(function(status, data) {
		if (status === 'success') {
			levelSuccessed();
		} else if (status === 'fail') {
			levelFailed(data);
		}
	});
}

module.exports = {
	init,
	levelSuccessed,
	levelFailed,
}