import { constants } from '../../common';
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

function levelSuccessful(data) {
	const levelCurrent = data[0];
	quoteNode.classList.remove('hidden');
	quoteNode.classList.add('fadeIn');
	quotePhrase.textContent = quotesSelected[levelCurrent][1].quote;
	quoteAuthor.textContent = quotesSelected[levelCurrent][1].author;
}

function levelFailed() {
	quoteNode.classList.add('hidden');
}

function init() {
	statusObserver.subscribe(function(status, data) {
		if (status === 'successLevel') {
			levelSuccessful(data);
		} else if (status === 'fail') {
			levelFailed();
		}
	});

	// Get sub-array of first n elements after shuffled
	quotesSelected = shuffled.slice(0, constants.levels.length + 1);
}

export default {
	init,
	quotes: quotesSelected,
}