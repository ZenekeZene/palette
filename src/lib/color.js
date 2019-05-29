const brightnessCoef = 30;
const differencialCoef = 20;
let swatchesHistorical = [];

function ColorObject(cmyk, el) {
	this.cmyk = cmyk;
	this.el = el;
	this.setCMYK(cmyk);
	this.isEnabled = true;
}

ColorObject.prototype.getCMYK = function() {
	if (this.el) {
		return JSON.parse('[' + this.el.getAttribute('data-cmyk') + ']');
	}
	return null;
};

ColorObject.prototype.setCMYK = function(cmyk) {
	this.cmyk = cmyk;
	if (this.el) {
		this.el.setAttribute('data-cmyk', cmyk);
		const cmykNode = document.createElement('span');
		cmykNode.classList.add('swatch__cmyk');
		cmykNode.innerHTML = cmyk;
		this.el.append(cmykNode);

		const rgbColor = getRGBColor(convertCMYKtoRGB(cmyk));
		this.el.style.backgroundColor = rgbColor;
	}
};

ColorObject.prototype.isMyNode = function(el) {
	return this.el === el;
};

function getRandomInterval(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRGBColor(RGBArray) {
	return `rgb(${RGBArray[0]}, ${RGBArray[1]}, ${RGBArray[2]})`;
}

function convertCMYKtoRGB(cmyk) {
	var color = [];
	color.push(255 * (1 - cmyk[0] / 100) * (1 - cmyk[3] / 100));
	color.push(255 * (1 - cmyk[1] / 100) * (1 - cmyk[3] / 100));
	color.push(255 * (1 - cmyk[2] / 100) * (1 - cmyk[3] / 100));
	return color;
}

function getColorCMYKRandom(contRepetitions) {
	const cmyk = [];
	cmyk.push(getRandomInterval(0, 100));
	cmyk.push(getRandomInterval(0, 100));
	cmyk.push(getRandomInterval(0, 100));
	cmyk.push(0);
	if (contRepetitions) {
		contRepetitions++;
	} else {
		contRepetitions = 0;
	}
	if (contRepetitions < 10) {
		if (calculateBrightnessCoefficient(cmyk) <= brightnessCoef) {
			return getColorCMYKRandom(contRepetitions);
		}
	}
	swatchesHistorical.push(cmyk);
	return cmyk;
}

function calculateSimilarCoefficient(cmyk) {
	let cont = 0;
	for (let i = 0; i < swatchesHistorical.length; i++) {
		let summation = 0;
		for (let j = 0; j < cmyk.length; j++) {
			const absSimilar = Math.abs(cmyk[j] - swatchesHistorical[i][j]);
			summation += absSimilar;
		}
		if (summation > differencialCoef) {
			cont++;
		}
	}
	return cont === swatchesHistorical.length;
}

function calculateBrightnessCoefficient(cmyk) {
	let summation = 0;
	for (let i = 0; i < cmyk.length; i++) {
		summation += cmyk[i];
	}
	return summation;
}

function getColorRelated(cmyk) {
	let colorRelationed = [];
	for (let i = 0; i < cmyk.length; i++) {
		const percentage = Math.random(0, 1).toFixed(2);
		const result = parseInt(cmyk[i] * percentage, 10);
		colorRelationed.push(result);
	}
	return colorRelationed;
}

function addColors(color1, color2) {
	if (color1.length === color2.length) {
		let color = [];
		for (let i = 0; i < color1.length; i++) {
			const add = parseInt(color1[i], 10) + parseInt(color2[i], 10);
			color.push(add < 100 ? add : 100);
		}
		return color;
	}
	return null;
}

function subtractColors(color1, color2) {
	if (color1.length === color2.length) {
		let color = [];
		for (let i = 0; i < color1.length; i++) {
			const sub = parseInt(color1[i], 10) - parseInt(color2[i], 10);
			color.push(sub > 0 ? sub : 0);
		}
		return color;
	}
	return null;
}

module.exports = {
	ColorObject,
	getRGBColor,
	convertCMYKtoRGB,
	getColorCMYKRandom,
	getColorRelated,
	addColors,
	subtractColors,
	getRandomInterval,
};;
