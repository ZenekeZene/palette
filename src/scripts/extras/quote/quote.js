import { constants, mutations } from '../../common';
const quotes = require('./quotes.json');

let statusObserver = constants.statusObserver;

const quotePhrase = document.getElementById('quotePhrase');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteNode = document.getElementById('quote');

var quotesArray = [];
for (var i in quotes) {
	quotesArray.push([i, quotes[i]]);
}

// Shuffle array
const shuffled = quotesArray.sort(() => 0.5 - Math.random());
let quotesSelected;

function successfulLevel() {
	let levelCurrent = mutations.getLevel();
	quoteNode.classList.remove('hidden');
	quoteNode.classList.add('fadeIn');
	quotePhrase.textContent = quotesSelected[levelCurrent][1].quote;
	quoteAuthor.textContent = quotesSelected[levelCurrent][1].author;
}

function failedLevel() {
	quoteNode.classList.add('hidden');
}

function init() {
	statusObserver.subscribe(function(status) {
		if (status === 'successfulLevel') {
			successfulLevel();
		} else if (status === 'failedLevel') {
			failedLevel();
		}
	});

	// Get sub-array of first n elements after shuffled
	quotesSelected = shuffled.slice(0, constants.levels.length);
}

export default {
	init,
	quotes: quotesSelected,
}