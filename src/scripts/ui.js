import persist from './persist';
import quote from './quote';
import sound from './sound';
import credits from './credits';
import record from './record';

let contSuccessTotal = Number(persist.getData('contSuccessTotal')) || 0;
const livesInitial = 1;
let lives = Number(persist.getData('lives')) || livesInitial;
let lifePrizes = [1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 13, 13, 21, 21];
let levels, levelCurrent, statusObserver, mute, shareUrl, shareUrlFinal, shareUrlFinalCompleted;
let playEnabled = true;

// Cache references to DOM elements.
var elms = [
	'control', 'nextButton', 'replayButton', 'playButton', 'backButton',
	'numLevels', 'score',
	'rateButton',
	'lives', 'liveIcon', 'livesText', 'livesOutMessage',
	'homePage', 'homeScore', 'homeLevel', 'homeLives',
	'finalPage', 'screenTutorial', 'replayText',
	'resetPage', 'resetCancel', 'resetAccept', 'resetButton',
	'soundButton', 'backButtonFinal', 'progression',
	'shareLink', 'shareLinkFinal', 'shareLinkFinalCompleted',
	'gameEndMessage', 'levelCurrentFinalPage',
];
elms.forEach(function(elm) {
	window[elm] = document.getElementById(elm);
});

const countSuccessfulFinal = document.getElementsByClassName('js-contSuccessfulFinalPage');

function showFinalPage(isGameCompleted) {
	control.classList.add('hidden');
	finalPage.classList.remove('hidden');
	finalPage.classList.add('fadeIn');

	for(let i = 0; i < countSuccessfulFinal.length; i++) {
		countSuccessfulFinal[i].textContent = contSuccessTotal;
	}
	levelCurrentFinal.textContent = levelCurrent + 1;

	setFinalMessage(isGameCompleted);
	statusObserver.notify('handRecord', { levelCurrent, contSuccessTotal });

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
		textTweet = `I+have+finished+@PlayPalette+with+${contSuccessTotal}+points+at+level+${levelCurrent + 1}`;
		shareUrlFinal = `https://twitter.com/intent/tweet?text=${textTweet}!!!+http://palette.ws`;
		gameEndMessage.classList.add('hidden');
		livesOutMessage.classList.remove('hidden');
	} else {
		textTweet = `I+have+overcome+all+the+levels+of+@PlayPalette+with+${contSuccessTotal}+points!!!+http://palette.ws`;
		shareUrlFinalCompleted = `https://twitter.com/intent/tweet?text=${textTweet}!!!+http://palette.ws`;
		livesOutMessage.classList.add('hidden');
		gameEndMessage.classList.remove('hidden');
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
		if (playEnabled) {
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
			playEnabled = false;
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

	backButtonFinal.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		playEnabled = true;
		app.classList.add('hidden');
		finalPage.classList.add('hidden');
		finalPage.classList.remove('fadeIn');
		homeScore.textContent = contSuccessTotal;
		homeLevel.textContent = levelCurrent + 1;
		numLevels.textContent = levelCurrent + 1;

		statusObserver.notify('showRecord');
		statusObserver.notify('cleanLevel');
		statusObserver.notify('backButton');

		if (levelCurrent !== levels.length - 1) {
			shareUrl = `I have finished @Palette at level ${levelCurrent} with ${score} points!!! Can you make it better? http://palette.ws`;
		} else {
			shareUrl = `I have overcome all the levels of @Palette with ${score} points  at level ${levelCurrent}!!! http://palette.ws`;
		}
	})

	backButton.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		playEnabled = true;
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

	rateButton.addEventListener('click', function() {
		let storeUrl;
		if (isMobile === 'Android') {
			storeUrl = 'market://details?id=com.pilpilgames.palette';
			window.location.replace(storeUrl);
		} else if (isMobile === 'iOS') {
			storeUrl = 'https://itunes.apple.com/app/id1467492943';
			openUrl(storeUrl);
		}
	});

	shareLink.addEventListener('click', function() {
		openUrl(`https://twitter.com/intent/tweet?text=${shareUrl}`);
	});

	shareLinkFinal.addEventListener('click', function() {
		openUrl(`https://twitter.com/intent/tweet?text=${shareUrlFinal}`);
	});

	shareLinkFinalCompleted.addEventListener('click', function() {
		openUrl(`https://twitter.com/intent/tweet?text=${shareUrlFinalCompleted}`);
	});
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

function showHome() {
	homePage.classList.remove('unveil');
	playEnabled = true;
	homePage.classList.add('fadeIn');
	homePage.classList.remove('fadeOut');
}

function init(statusObserverEntry, levelsEntry, levelCurrentEntry) {
	quote.init(statusObserverEntry, levelsEntry.length);
	statusObserver = statusObserverEntry;
	levels = levelsEntry;
	levelCurrent = levelCurrentEntry;
	statusObserver.subscribe(function(status) {
		if (status === 'successLevel') {
			levelSuccessful();
		} else if (status === 'fail') {
			levelFailed();
		} else if (status === 'increaseScore') {
			increaseScore();
		} else if (status === 'showHome') {
			showHome();
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
	credits.init(statusObserver);
	record.init(statusObserver);

	lives = Number(persist.getData('lives')) || livesInitial;
	homeLives.textContent = livesText.textContent = lives;
}

export default {
	init,
};
