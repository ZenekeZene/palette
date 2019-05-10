import './styles/styles.scss';
import 'animate.css';
const game = require('./lib/game');
const persist = require('./lib/persist');

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const app = document.getElementById('app');
const nextButton = document.getElementById('nextButton');
const replayButton = document.getElementById('replayButton');
const control = document.getElementById('control');
const numLevels = document.getElementById('numLevels');
const score = document.getElementById('score');
const playButton = document.getElementById('playButton');
const backButton = document.getElementById('backButton');
const homePage = document.getElementById('homePage');
const homeScore = document.getElementById('homeScore');
const homeLevel = document.getElementById('homeLevel');
const screenTutorial = document.getElementById('screenTutorial');
const quotePhrase = document.getElementById('quotePhrase');
const quoteAuthor = document.getElementById('quoteAuthor');
const quote = document.getElementById('quote');
const quotes = require('./lib/quotes.json');
const replayText = document.getElementById('replayText');

var quotesArray = [];
for (var i in quotes) {
	quotesArray.push([i, quotes[i]]);
}

// Shuffle array
const shuffled = quotesArray.sort(() => 0.5 - Math.random());

// Get sub-array of first n elements after shuffled
let quotesSelected = shuffled.slice(0, levels.length);
console.log(quotesSelected);

let levelCurrent = parseInt(persist.getData('levelCurrent'), 10) || 0;
let contSuccessTotal = persist.getData('contSuccessTotal') || 0;

playButton.addEventListener('click', function() {
	homePage.classList.add('unveil');
	if (persist.getData('tutorialIsNotLaunched') !== 'false') {
		screenTutorial.classList.remove('hidden');
		screenTutorial.classList.add('fadeIn');
	} else {
		app.classList.add('fadeIn');
		app.classList.remove('fadeOut');
		app.classList.remove('hidden');
	}
});

backButton.addEventListener('click', function() {
	homePage.classList.remove('unveil');
	app.classList.add('fadeOut', 'animated');
	app.classList.remove('fadeIn');
	homeScore.textContent = contSuccessTotal;
	homeLevel.textContent = levelCurrent + 1;
});

screenTutorial.addEventListener('click', function() {
	screenTutorial.classList.remove('fadeIn');
	screenTutorial.classList.add('fadeOut');
	app.classList.add('fadeIn');
	app.classList.remove('fadeOut');
	app.classList.remove('hidden');
});

function scoreToAument() {
	contSuccessTotal++;
	score.textContent = contSuccessTotal;
	persist.saveData('contSuccessTotal', contSuccessTotal);
}

function levelSuccessed() {
	control.classList.add('fadeIn', 'animated');
	control.classList.remove('hidden');
	app.classList.add('fadeOut', 'animated');
	nextButton.classList.remove('hidden');
	nextButton.classList.add('fadeIn', 'animated');
	replayButton.classList.add('hidden');
	levelCurrent++;
	replayText.classList.add('hidden');
	quote.classList.remove('hidden');
	quote.classList.add('fadeIn', 'animated');
	quotePhrase.textContent = quotesSelected[levelCurrent][1].quote;
	quoteAuthor.textContent = quotesSelected[levelCurrent][1].author;
	persist.saveData('levelCurrent', levelCurrent);
}

function levelFailed(dropzoneWasCorrect, swatchWasCorrect, swatches, dropzones) {
	dropzoneWasCorrect.el.classList.add('wasCorrect');
	swatchWasCorrect.el.classList.add('wasCorrect');
	const swatchesNotCorrect = swatches.filter(
		(swatch) => !swatch.el.classList.contains('wasCorrect')
	);
	for (let i = 0; i < swatchesNotCorrect.length; i++) {
		swatchesNotCorrect[i].el.classList.add('match-swatch');
	}
	const dropzonesNotCorrect = dropzones.filter(
		(dropzone) => !dropzone.el.classList.contains('wasCorrect')
	);
	for (let i = 0; i < dropzonesNotCorrect.length; i++) {
		dropzonesNotCorrect[i].el.classList.add('match-swatch');
	}
	setTimeout(() => {
		control.classList.add('fadeIn', 'animated');
		control.classList.remove('hidden');
		app.classList.add('fadeOut', 'animated');
		nextButton.classList.add('hidden');
		quote.classList.add('hidden');
		replayText.classList.remove('hidden');
		replayText.classList.add('fadeIn', 'animated');
		replayButton.classList.remove('hidden');
		replayButton.classList.add('fadeIn', 'animated');
	}, 700);
}

function handNextLevel() {
	numLevels.textContent = levelCurrent + 1;
	showLevel();
}

function showLevel() {
	game.playLevel(levels[levelCurrent]);
	control.classList.add('hidden');
	app.classList.remove('fadeOut');
	app.classList.add('fadeIn', 'animated');
}

nextButton.addEventListener('click', handNextLevel);
replayButton.addEventListener('click', showLevel);

game.setup(app, levelSuccessed, levelFailed, scoreToAument);

homeScore.textContent = contSuccessTotal;
homeLevel.textContent = levelCurrent + 1;
numLevels.textContent = levelCurrent + 1;
score.textContent = contSuccessTotal;

game.playLevel(levels[levelCurrent]);

// Hack for window height with navigation bars

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
