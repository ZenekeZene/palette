import interact from 'interactjs';
import persist from './persist';
import quote from './quote';
import sound from './sound';

let contSuccessTotal = Number(persist.getData('contSuccessTotal')) || 0;
const livesInitial = 5;
let lives = Number(persist.getData('lives')) || livesInitial;
let lifePrizes = [0, 0, 1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 13, 13];
let levels, levelCurrent, statusObserver, mute;

// Cache references to DOM elements.
var elms = [
	'control', 'nextButton', 'replayButton', 'playButton', 'backButton',
	'numLevels', 'score',
	'lives', 'liveIcon', 'livesText', 'livesOutMessage',
	'homePage', 'homeScore', 'homeLevel', 'homeLives', 'homeHighScore',
	'finalPage', 'screenTutorial', 'replayText',
	'resetPage', 'resetCancel', 'resetAccept', 'resetButton',
	'credits', 'creditsButton', 'creditsPage', 'backButtonCredits',
	'soundButton', 'backButtonFinal', 'progression',
	'shareLink', 'shareLinkFinal', 'shareLinkFinalCompleted',
	'gameEndMessage', 'levelCurrentFinalPage', 'highLevel', 'highScore',
];
elms.forEach(function(elm) {
	window[elm] = document.getElementById(elm);
});

const countSuccessfulFinal = document.getElementsByClassName('js-contSuccessfulFinalPage');
let creditsInterval;

function showFinalPage(isGameCompleted) {
	control.classList.add('hidden');
	finalPage.classList.remove('hidden');
	finalPage.classList.add('fadeIn');

	for(let i = 0; i < countSuccessfulFinal.length; i++) {
		countSuccessfulFinal[i].textContent = contSuccessTotal;
	}
	levelCurrentFinal.textContent = levelCurrent + 1;

	setFinalMessage(isGameCompleted);

	handRecord();

	lives = livesInitial;
	levelCurrent = 0;
	contSuccessTotal = 0;

	persist.saveData('lives', lives);
	persist.saveData('levelCurrent', 0);
	persist.saveData('contSuccessTotal', 0);

	livesText.textContent = lives;
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
		homeHighScore.classList.remove('hidden');
		if (levelCurrent > levelRecord) {
			saveRecord();
		} else if (levelCurrent == levelRecord) {
			if (contSuccessTotal > scoreRecord) {
				saveRecord();
			}
		}
	} else {
		saveRecord();
	}
}

function saveRecord() {
	persist.saveData('record', `${levelCurrent + 1}|${contSuccessTotal}`);
	updateRecord(levelCurrent, contSuccessTotal);
}

function showRecord() {
	const {levelRecord, scoreRecord} = getRecord();
	if (levelRecord) {
		updateRecord(levelRecord, scoreRecord);
		homeHighScore.classList.remove('hidden');
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

function levelSuccessful() {
	if (levelCurrent === levels.length - 1) {
		showFinalPage(true);
		return;
	}
	const livesAdded = lifePrizes[levelCurrent];
	lives += livesAdded;
	persist.saveData('lives', lives);
	livesText.textContent = lives;
	if (livesAdded === 0) {
		liveIcon.textContent = 0;
		liveIcon.classList.add('hidden');
	} else {
		liveIcon.textContent = `+${livesAdded}`;
		liveIcon.classList.remove('hidden');
	}

	levelCurrent += 1;
	persist.saveData('levelCurrent', levelCurrent);

	control.classList.add('fadeIn');
	control.classList.remove('hidden');
	app.classList.remove('fadeIn');
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

			livesText.textContent = lives;
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
		levelCurrent = Number(persist.getData('levelCurrent')) || 0;
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
		homePage.classList.add('fadeOut');
		homePage.classList.remove('fadeIn');
		creditsPage.classList.remove('hidden');
		initCreditsDrag();
	});

	backButtonCredits.addEventListener('click', function() {
		homePage.classList.add('fadeIn');
		homePage.classList.remove('fadeOut');
		homePage.classList.remove('unveil');
		creditsPage.classList.add('hidden');
		clearCredits();
	});

	backButtonFinal.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		app.classList.add('hidden');
		finalPage.classList.add('hidden');
		finalPage.classList.remove('fadeIn');
		homeScore.textContent = contSuccessTotal;
		homeLevel.textContent = levelCurrent + 1;
		showRecord();
		statusObserver.notify('cleanLevel');
		statusObserver.notify('backButton');
	})

	backButton.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		app.classList.add('fadeOut', 'animated');
		app.classList.remove('fadeIn');
		homeScore.textContent = contSuccessTotal;
		homeLevel.textContent = levelCurrent + 1;
		statusObserver.notify('cleanLevel');
		statusObserver.notify('backButton');
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
		if (mute) {
			soundButton.classList.add('--silence');
		} else {
			soundButton.classList.remove('--silence');
		}
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
	statusObserver.notify('playLevel', levelCurrent);
	control.classList.add('hidden');
	app.classList.remove('fadeOut');
	app.classList.add('fadeIn');
}

function increaseScore() {
	contSuccessTotal += Number(10);
	score.textContent = contSuccessTotal;
	persist.saveData('contSuccessTotal', Number(contSuccessTotal));
}

function init(statusObserverEntry, levelsEntry, levelCurrentEntry) {
	quote.init(statusObserverEntry, levelsEntry.length);
	statusObserver = statusObserverEntry;
	levels = levelsEntry;
	levelCurrent = levelCurrentEntry;
	statusObserver.subscribe(function(status) {
		if (status === 'success') {
			levelSuccessful();
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
	mute = (mute == 'true');
	
	if (mute) {
		soundButton.classList.add('--silence');
	} else {
		soundButton.classList.remove('--silence');
	}
	sound.init(statusObserver, mute);
	lives = Number(persist.getData('lives')) || livesInitial;
	homeLives.textContent = livesText.textContent = lives;

	interact('.credits-container').draggable({
		inertia: true,
		restriction: '.credits',
		lockAxis: 'y',
		onmove: (event) => {
			event.target.classList.remove('--animation-disabled');
			const target = event.target,
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data-x')) || 0) + Math.round(event.dx),
				y = (parseFloat(target.getAttribute('data-y')) || 0) + Math.round(event.dy);
			target.classList.add('drag-active');
			// translate the element
			target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

			// update the posiion attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		},
	});

	showRecord();
}

function initCreditsDrag() {
	creditsInterval = setInterval(function() {
		const rect = credits.getBoundingClientRect();
		if (!insideViewport(rect)) {
			if (rect.bottom <= 0) {
				setPositionCredits(0, window.innerHeight);
			}
		}

		// keep the dragged position in the data-x/data-y attributes
		const x = (parseFloat(credits.getAttribute('data-x')) || 0);
		const y = (parseFloat(credits.getAttribute('data-y')) || 0) - 2;
		setPositionCredits(x, y);
	}, 30);
}

function clearCredits() {
	clearInterval(creditsInterval);
	setPositionCredits(0, 0);
}

function setPositionCredits(x, y) {
	credits.style.webkitTransform = credits.style.transform = `translate(${x}px, ${y}px)`;
	// update the posiion attributes
	credits.setAttribute('data-x', x);
	credits.setAttribute('data-y', y);
}

function insideViewport(bounding) {
	if (
		bounding.top >= 0 &&
		bounding.left >= 0 &&
		bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
		bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
	) {
		return true;
	} else {
		return false;
	}
}

export default {
	init,
};
