import { constants, state } from '../common';
import record from '../extras/record';
import persist from '../tools/persist';
import quote from '../extras/quote/quote';
import sound from '../extras/sound';
import credits from '../pages/credits';
import final from '../pages/final';

let levelCurrent = state.levelCurrent;
let score = state.score;
let lives = Number(persist.getData('lives')) || constants.livesInitial;
const statusObserver = constants.statusObserver;
let shareUrl;
let playEnabled = true;

// Cache references to DOM elements:
const elms = [
	'control', 'nextButton', 'replayButton', 'playButton', 'backButton',
	'numLevels', 'scoreText',
	'rateButton',
	'lives', 'liveIcon', 'livesText',
	'homePage', 'homeScore', 'homeLevel', 'homeLives',
	'screenTutorial', 'replayText',
	'resetPage', 'resetCancel', 'resetAccept', 'resetButton',
	'backButtonFinal', 'progression',
	'shareLink',
];

elms.forEach(function(elm) {
	window[elm] = document.getElementById(elm);
});

function levelSuccessful() {
	if (levelCurrent === constants.levels.length - 1) {
		showFinalPage();
		return;
	}
	const livesAdded = constants.lifePrizes[levelCurrent];
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
			statusObserver.notify('showFinalPage', false);
		}
	}, 700);
}

function handEvents() {
	playButton.addEventListener('click', function() {
		if (playEnabled) {
			levelCurrent = Number(persist.getData('levelCurrent')) || 0;
			if (levelCurrent === constants.levels.length) {
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
		persist.saveData('score', 0);
		persist.saveData('levelCurrent', 0);

		persist.saveData('lives', constants.livesInitial);
		homeLives.textContent = lives;

		levelCurrent = 0;
		score = 0;
		homeScore.textContent = score;
		homeLevel.textContent = levelCurrent + 1;
		numLevels.textContent = levelCurrent + 1;
		scoreText.textContent = score;
		location.reload();
	});

	backButtonFinal.addEventListener('click', function() {
		homePage.classList.remove('unveil');
		playEnabled = true;
		app.classList.add('hidden');
		finalPage.classList.add('hidden');
		finalPage.classList.remove('fadeIn');
		homeScore.textContent = score;
		homeLevel.textContent = levelCurrent + 1;
		numLevels.textContent = levelCurrent + 1;

		statusObserver.notify('showRecord');
		statusObserver.notify('cleanLevel');
		statusObserver.notify('backButton');

		if (levelCurrent !== constants.levels.length - 1) {
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
		homeScore.textContent = score;
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
}

function showFinalPage(isGameCompleted) {
	const levelCurrent = levelCurrent;
	statusObserver.notify('showFinalPage', {
		isGameCompleted,
		levelCurrent,
		score,
	});

	lives = constants.livesInitial;
	levelCurrent = 0;
	score = 0;

	persist.saveData('bonus', 0);
	persist.saveData('lives', lives);
	persist.saveData('levelCurrent', 0);
	persist.saveData('score', 0);

	livesText.textContent = homeLives.textContent = lives;
	homeLevel.textContent = levelCurrent;
	homeScore.textContent = score;
	statusObserver.notify('handRecord');
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
	score += Number(constants.scorePerSuccess);
	scoreText.textContent = score;
	persist.saveData('score', Number(score));
}

function showHome() {
	homePage.classList.remove('unveil');
	playEnabled = true;
	homePage.classList.add('fadeIn');
	homePage.classList.remove('fadeOut');
}

function init() {
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
	homeScore.textContent = score;
	homeLevel.textContent = levelCurrent + 1;
	numLevels.textContent = levelCurrent + 1;
	scoreText.textContent = score;

	lives = Number(persist.getData('lives')) || constants.livesInitial;
	homeLives.textContent = livesText.textContent = lives;

	quote.init();
	sound.init();
	credits.init();
	record.init();
	final.init();

}

export default {
	init,
};
