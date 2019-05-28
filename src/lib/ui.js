const persist = require('./persist');
const quote = require('./quote');
const sound = require('./sound');
let contSuccessTotal = persist.getData('contSuccessTotal') || 0;
const livesInitial = 3;
let lives = Number(persist.getData('lives')) || livesInitial;
let levels, levelCurrent, statusObserver, mute;

const nextButton = document.getElementById('nextButton');
const replayButton = document.getElementById('replayButton');
const control = document.getElementById('control');
const numLevels = document.getElementById('numLevels');
const score = document.getElementById('score');
const livesNode = document.getElementById('lives');
const liveIcon = document.getElementById('liveIcon');
const playButton = document.getElementById('playButton');
const backButton = document.getElementById('backButton');
const homePage = document.getElementById('homePage');
const finalPage = document.getElementById('finalPage');
const homeScore = document.getElementById('homeScore');
const homeLevel = document.getElementById('homeLevel');
const homeLives = document.getElementById('homeLives');
const screenTutorial = document.getElementById('screenTutorial');

const replayText = document.getElementById('replayText');
const resetButton = document.getElementById('resetButton');
const resetPage = document.getElementById('resetPage');
const resetCancel = document.getElementById('resetCancel');
const resetAccept = document.getElementById('resetAccept');
const creditsButton = document.getElementById('creditsButton');
const creditsPage = document.getElementById('creditsPage');
const soundButton = document.getElementById('soundButton');
const backButtonCredits = document.getElementById('backButtonCredits');
const backButtonFinal = document.getElementById('backButtonFinal');
const progression = document.getElementById('progression');
const shareLink = document.getElementById('shareLink');
const shareLinkFinal = document.getElementById('shareLinkFinal');
const shareLinkFinalCompleted = document.getElementById('shareLinkFinalCompleted');
const livesOutMessage = document.getElementById('lives-out-message');
const gameEndMessage = document.getElementById('game-end-message');
const countSuccessFinal = document.getElementsByClassName('js-contSuccesFinalPage');
const levelCurrentFinal = document.getElementsByClassName('js-levelCurrentFinalPage');
const highLevel = document.getElementById('highlevel');
const highScore = document.getElementById('highscore');

function showFinalPage(isGameCompleted) {
	control.classList.add('hidden');
	finalPage.classList.remove('hidden');
	for(let i = 0; i < countSuccessFinal.length; i++) {
		countSuccessFinal[i].textContent = contSuccessTotal;
		levelCurrentFinal[i].textContent = levelCurrent;
	}

	setFinalMessage(isGameCompleted);

	handRecord();

	lives = livesInitial;
	levelCurrent = 0;
	contSuccessTotal = 0;

	persist.saveData('lives', lives);
	persist.saveData('levelCurrent', 0);
	persist.saveData('contSuccessTotal', 0);

	livesNode.textContent = lives;
	homeLives.textContent = lives;
	homeLevel.textContent = levelCurrent;
	homeScore.textContent = contSuccessTotal;
}

function setFinalMessage(gameCompleted) {
	let textTweet = '';
	if (!gameCompleted) {
		textTweet = `I+have+finished+@PlayPalette+with+${contSuccessTotal}+points+at+level+${levelCurrent}`;
		shareLinkFinal.setAttribute('href', `https://twitter.com/intent/tweet?text=${textTweet}!!!+http://palette.ws`);
		gameEndMessage.classList.add('hidden');
		livesOutMessage.classList.remove('hidden');
	} else {
		textTweet = `I+have+overcome+all+the+levels+of+@PlayPalette+with+${contSuccessTotal}+points!!!+http://palette.ws`;
		shareLinkFinalCompleted.setAttribute('href', `https://twitter.com/intent/tweet?text=${textTweet}!!!+http://palette.ws`);
		livesOutMessage.classList.add('hidden');
		gameEndMessage.classList.remove('hidden');
	}
}

function getRecord() {
	let items = [0, 0];
	const record = persist.getData('record');
	if (record) {
		items = record.split('|');
	}
	return {
		levelRecord: Number(items[0]),
		scoreRecord: Number(items[1]),
	};
}

function handRecord() {
	const {levelRecord, scoreRecord } = getRecord();
	if (levelRecord) {
		if (levelCurrent > levelRecord) {
			persist.saveData('record', `${levelCurrent}|${contSuccessTotal}`);
			updateRecord(levelCurrent, contSuccessTotal);
		} else if (levelCurrent == levelRecord) {
			if (contSuccessTotal > scoreRecord) {
				persist.saveData('record', `${levelCurrent}|${contSuccessTotal}`);
				updateRecord(levelCurrent, contSuccessTotal);
			}
		}
	} else {
		persist.saveData('record', `${levelCurrent}|${contSuccessTotal}`);
		updateRecord(levelCurrent, contSuccessTotal);
	}
}

function updateRecord(level, score) {
	highLevel.textContent = level;
	highScore.textContent = score;
	if (level !== levels.length - 1) {
		shareLink.setAttribute('href', `I have finished @Palette at level ${level} with ${score} points!!! Can you make it better? http://palette.ws`);
	} else {
		shareLink.setAttribute('href', `I have overcome all the levels of @Palette with ${score} points  at level ${level}!!! http://palette.ws`);
	}
}

function levelSuccessed() {
	if (levelCurrent === levels.length - 1) {
		showFinalPage(true);
	}

	levelCurrent += 1;
	persist.saveData('levelCurrent', levelCurrent);

	lives += 1;
	persist.saveData('lives', lives);
	livesNode.textContent = lives;
	liveIcon.classList.remove('hidden');

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
		if (lives !== 1) {
			lives -= 1;
			persist.saveData('lives', lives);

			livesNode.textContent = lives;
			liveIcon.classList.add('hidden');
			control.classList.add('fadeIn');
			control.classList.remove('hidden');
			app.classList.add('fadeOut');
			nextButton.classList.add('hidden');
			replayText.classList.remove('hidden');
			replayText.classList.add('fadeIn');
			replayButton.classList.remove('hidden');
			replayButton.classList.add('fadeIn');
		} else {
			showFinalPage();
		}
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

		persist.saveData('lives', livesInitial);
		homeLives.textContent = lives; 

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
		app.classList.add('hidden');
		finalPage.classList.add('hidden');

		statusObserver.notify('cleanLevel');
	})

	backButton.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		app.classList.add('fadeOut', 'animated');
		app.classList.remove('fadeIn');
		homeScore.textContent = contSuccessTotal;
		homeLevel.textContent = levelCurrent + 1;
		statusObserver.notify('cleanLevel');
	});

	screenTutorial.addEventListener('click', function() {
		screenTutorial.classList.remove('fadeIn');
		screenTutorial.classList.add('fadeOut');
		app.classList.add('fadeIn');
		app.classList.remove('fadeOut');
		app.classList.remove('hidden');
	});

	soundButton.addEventListener('click', function() {
		mute = !mute;
		persist.saveData('mute', mute);
		event.target.classList.toggle('--silence');
		statusObserver.notify('mute', mute);
	})

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

function increaseScore() {
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
		} else if (status === 'increaseScore') {
			increaseScore();
		}
	});

	handEvents();
	homeScore.textContent = contSuccessTotal;
	homeLevel.textContent = levelCurrent + 1;
	numLevels.textContent = levelCurrent + 1;
	score.textContent = contSuccessTotal;
	mute = persist.getData('mute') || false;
	sound.init(statusObserver, mute);
	if (mute) {
		soundButton.classList.add('--silence');
	}
	lives = Number(persist.getData('lives')) || livesInitial;
	homeLives.textContent = lives;
	
	const {levelRecord, scoreRecord} = getRecord();
	if (levelRecord) {
		updateRecord(levelRecord, scoreRecord);
	}
}

module.exports = {
	init
}
