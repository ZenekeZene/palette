import color from './color';
const _ = require('lodash');

export default {
	_giveMeTheSolution: function(numItems, swatches, dropzones, activeColor) {
		for(let i = 0; i < numItems; i++) {
			swatches[i].el.classList.remove('--is-correct');
			dropzones[i].el.classList.remove('--is-correct');
		}
		for(let i = 0; i < numItems; i++) {
			const pos = new color.ColorObject(
				color.addColors(dropzones[i].cmyk, activeColor.cmyk),
				null);
			if (_.isEqual(swatches[i].cmyk, pos.cmyk)) {
				swatches[i].el.classList.add('--is-correct');
				dropzones[i].el.classList.add('--is-correct');
				return i;
			}
		}
		return null;
	}
}