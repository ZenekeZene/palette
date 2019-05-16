const persist = require('./persist');
const quote = require('./quote');
let contSuccessTotal = persist.getData('contSuccessTotal') || 0;
let levels, levelCurrent, statusObserver;

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

const replayText = document.getElementById('replayText');
const resetButton = document.getElementById('resetButton');
const resetPage = document.getElementById('resetPage');
const resetCancel = document.getElementById('resetCancel');
const resetAccept = document.getElementById('resetAccept');
const creditsButton = document.getElementById('creditsButton');
const creditsPage = document.getElementById('creditsPage');
const backButtonCredits = document.getElementById('backButtonCredits');
const backButtonFinal = document.getElementById('backButtonFinal');
const progression = document.getElementById('progression');
const shareLink = document.getElementById('shareLink');

function levelSuccessed() {
	if (levelCurrent === levels.length - 1) {
		const finalPage = document.getElementById('finalPage');
		finalPage.classList.remove('hidden');
		document.getElementById('contSuccesFinalPage').textContent = contSuccessTotal;
		document.getElementById('shareLinkFinal').setAttribute('href', `https://twitter.com/intent/tweet?text=I+have+finished+@Palette_game+using+${levelCurrent + 1}+colors!!!+http://palette.ws`);
		return;
	}

	levelCurrent += 1;
	persist.saveData('levelCurrent', levelCurrent);

	control.classList.add('fadeIn');
	control.classList.remove('hidden');
	app.classList.add('fadeOut');
	nextButton.classList.remove('hidden');
	nextButton.classList.add('fadeIn');
	replayButton.classList.add('hidden');
	replayText.classList.add('hidden');
	progression.classList = '';
	progression.classList.add('progression', `level-${levelCurrent}`);
	homeLevel.textContent = levelCurrent + 1;
	numLevels.textContent = levelCurrent + 1;
}

function levelFailed() {
	progression.classList = '';
	progression.classList.add('progression', `level-${levelCurrent}`);
	setTimeout(() => {
		control.classList.add('fadeIn');
		control.classList.remove('hidden');
		app.classList.add('fadeOut');
		nextButton.classList.add('hidden');
		replayText.classList.remove('hidden');
		replayText.classList.add('fadeIn');
		replayButton.classList.remove('hidden');
		replayButton.classList.add('fadeIn');
	}, 700);
}

function handEvents() {
	playButton.addEventListener('click', function() {
		levelCurrent = parseInt(persist.getData('levelCurrent'), 10) || 0;
		if (levelCurrent === levels.length) {
			resetPage.classList.remove('hidden');
			return false;
		}
		homePage.classList.add('unveil');
		statusObserver.notify('playLevel');
		if (persist.getData('tutorialIsNotLaunched') !== 'false') {
			screenTutorial.classList.remove('hidden');
			screenTutorial.classList.add('fadeIn');
			screenTutorial.classList.remove('fadeOut');
		} else {
			app.classList.add('fadeIn');
			app.classList.remove('fadeOut');
			app.classList.remove('hidden');
		}
	});
	
	resetButton.addEventListener('click', function(event) {
		resetPage.classList.remove('hidden');
	});
	
	resetCancel.addEventListener('click', function(event) {
		resetPage.classList.add('hidden');
	});
	
	resetAccept.addEventListener('click', function(event) {
		resetPage.classList.add('hidden');
		persist.saveData('tutorialIsNotLaunched', true);
		persist.saveData('contSuccessTotal', 0);
		persist.saveData('levelCurrent', 0);
		levelCurrent = 0;
		contSuccessTotal = 0;
		homeScore.textContent = contSuccessTotal;
		homeLevel.textContent = levelCurrent + 1;
		numLevels.textContent = levelCurrent + 1;
		score.textContent = contSuccessTotal;
		location.reload();
	});
	
	creditsButton.addEventListener('click', function() {
		creditsPage.classList.remove('hidden');
	});
	
	backButtonCredits.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		creditsPage.classList.add('hidden');
	});

	backButtonFinal.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		finalPage.classList.add('hidden');
	})
	
	shareLink.addEventListener('click', function(event) {
		const target = event.target;
		target.setAttribute('href', `https://twitter.com/intent/tweet?text=I+have+reached+level+${levelCurrent + 1}+playing+@Palette_game!!!+http://palette.ws`);
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
	
	nextButton.addEventListener('click', handNextLevel);
	replayButton.addEventListener('click', showLevel);
}

function handNextLevel() {
	numLevels.textContent = levelCurrent + 1;
	showLevel();
}

function showLevel() {
	statusObserver.notify('playLevel');
	control.classList.add('hidden');
	app.classList.remove('fadeOut');
	app.classList.add('fadeIn');
}

function scoreToAument() {
	contSuccessTotal++;
	score.textContent = contSuccessTotal;
	persist.saveData('contSuccessTotal', contSuccessTotal);
}

function init(statusObserverEntry, levelsEntry, levelCurrentEntry) {
	quote.init(statusObserverEntry, levelsEntry.length);
	statusObserver = statusObserverEntry;
	levels = levelsEntry;
	levelCurrent = levelCurrentEntry;
	statusObserver.subscribe(function(status) {
		if (status === 'success') {
			levelSuccessed();
		} else if (status === 'fail') {
			levelFailed();
		} else if (status === 'scoreToAument') {
			scoreToAument();
		}
	});

	handEvents();
	homeScore.textContent = contSuccessTotal;
	homeLevel.textContent = levelCurrent + 1;
	numLevels.textContent = levelCurrent + 1;
	score.textContent = contSuccessTotal;
}

module.exports = {
	init	
}