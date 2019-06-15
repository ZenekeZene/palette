import { constants, mutations, actions } from '../common';
import record from '../extras/record';
import quote from '../extras/quote/quote';
import sound from '../extras/sound';
import credits from '../pages/credits';
import home from '../pages/home';
import final from '../pages/final';
import reset from '../pages/reset';

const statusObserver = constants.statusObserver;

// Cache references to DOM elements:
const elms = [
	'control', 'nextButton', 'replayButton', 'playButton', 'backButton',
	'rateButton',
	'liveIcon',
	'screenTutorial', 'replayText',
	'backButtonFinal',
	'progression',
	'shareLink',
];

elms.forEach(function(elm) {
	window[elm] = document.getElementById(elm);
});

function successfulLevel() {
	let levelCurrent = mutations.getLevel();
	console.log(mutations.areLevelsFinished());
	if (mutations.areLevelsFinished()) {
		showFinalPage();
	} else {
		actions.increaseLife();
		levelCurrent = actions.increaseLevel();
		progression.classList.add('progression', `level-${ levelCurrent + 1 }`);

		control.classList.add('fadeIn');
		control.classList.remove('hidden');
		app.classList.remove('fadeIn');
		app.classList.add('fadeOut');
		nextButton.classList.remove('hidden');
		nextButton.classList.add('fadeIn');
		replayButton.classList.add('hidden');
		replayText.classList.add('hidden');
	}
}

function failedLevel() {
	progression.classList.add('progression', `level-${mutations.getLevel()}`);
	let lives = mutations.getLives();
	if (lives !== 1) {
		actions.decreaseLife();

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
}

function handEvents() {

	backButtonFinal.addEventListener('click', function() {
		app.classList.add('hidden');
		finalPage.classList.add('hidden');
		finalPage.classList.remove('fadeIn');

		statusObserver.notify('showHome');
		statusObserver.notify('cleanLevel');
		statusObserver.notify('showRecord');
		statusObserver.notify('backButton');
	});

	backButton.addEventListener('click', function() {
		statusObserver.notify('showHome');		
		statusObserver.notify('cleanLevel');
		statusObserver.notify('backButton');
		app.classList.add('fadeOut', 'animated');
		app.classList.remove('fadeIn');
	});

	screenTutorial.addEventListener('click', function() {
		screenTutorial.classList.remove('fadeIn');
		screenTutorial.classList.add('fadeOut');
		app.classList.add('fadeIn');
		app.classList.remove('fadeOut');
		app.classList.remove('hidden');
	});

	nextButton.addEventListener('click', showLevel);
	replayButton.addEventListener('click', showLevel);
}

function showFinalPage(isGameCompleted) {
	statusObserver.notify('showFinalPage', isGameCompleted);
	statusObserver.notify('handRecord');
}

function showLevel() {
	statusObserver.notify('playLevel');
	control.classList.add('hidden');
	app.classList.remove('fadeOut');
	app.classList.add('fadeIn');
}

function init() {
	statusObserver.subscribe(function(status) {
		if (status === 'successfulLevel') {
			successfulLevel();
		} else if (status === 'failedLevel') {
			failedLevel();
		} else if (status === 'increaseScore') {
			actions.increaseScore();
		}
	});

	handEvents();
	
	home.init();
	quote.init();
	sound.init();
	credits.init();
	record.init();
	final.init();
	reset.init();
	
	statusObserver.notify('showHome');
}

export default {
	init,
};
