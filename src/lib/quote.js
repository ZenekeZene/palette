const quotes = require('./quotes.json');

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

function levelSuccessed(data) {
	const levelCurrent = data[0];
	quoteNode.classList.remove('hidden');
	quoteNode.classList.add('fadeIn');
	quotePhrase.textContent = quotesSelected[levelCurrent][1].quote;
	quoteAuthor.textContent = quotesSelected[levelCurrent][1].author;
}

function levelFailed() {
	quoteNode.classList.add('hidden');
}

function init(statusObserverEntry, numLevelsEntry) {
	numLevels = numLevelsEntry;
	statusObserver = statusObserverEntry;
	statusObserver.subscribe(function(status, data) {
		if (status === 'success') {
			levelSuccessed(data);
		} else if (status === 'fail') {
			levelFailed();
		}
	});

	// Get sub-array of first n elements after shuffled
	quotesSelected = shuffled.slice(0, numLevels + 1);
}

module.exports = {
	init,
	quotes: quotesSelected,
}