const _ = require('lodash');
const brightnessCoef = 30;
const rangePercentageRelated = [0.1, 0.9];

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
	color.push(Math.round(255 * (1 - cmyk[0] / 100) * (1 - cmyk[3] / 100)));
	color.push(Math.round(255 * (1 - cmyk[1] / 100) * (1 - cmyk[3] / 100)));
	color.push(Math.round(255 * (1 - cmyk[2] / 100) * (1 - cmyk[3] / 100)));
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
	return cmyk;
}

function calculateBrightnessCoefficient(cmyk) {
	let summation = 0;
	for (let i = 0; i < cmyk.length; i++) {
		summation += cmyk[i];
	}
	return summation;
}

function getColorRelated(cmyk) {
	let colorRelated = [];
	for (let i = 0; i < cmyk.length; i++) {
		const percentage = Math.random(rangePercentageRelated[0], rangePercentageRelated[1]).toFixed(2);
		const result = parseInt(cmyk[i] * percentage, 10);
		colorRelated.push(result);
	}
	return colorRelated;
}

function addColors(color1, color2) {
	console.log(color1);
	console.log(color2);
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

function areEqualColors(color1, color2) {
	return _.isEqual(color1, color2);
}

export default {
	getRGBColor,
	convertCMYKtoRGB,
	getColorCMYKRandom,
	getColorRelated,
	addColors,
	subtractColors,
	areEqualColors,
	getRandomInterval,
};
