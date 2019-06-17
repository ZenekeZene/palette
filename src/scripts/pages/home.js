import { constants, mutations, config } from '../common';
import persist from '../tools/persist';

let playEnabled = true;
let shareUrl;
const statusObserver = constants.statusObserver;

const playButton = document.getElementById('playButton');
const rateButton = document.getElementById('rateButton');
const homePage = document.getElementById('homePage');

function showHome() {
	homePage.classList.remove('unveil');
	homePage.classList.add('fadeIn');
	homePage.classList.remove('fadeOut');
	playEnabled = true;
}

function showGame() {
	app.classList.add('fadeIn');
	app.classList.remove('fadeOut');
	app.classList.remove('hidden');
}

function showTutorial() {
	screenTutorial.classList.remove('hidden');
	screenTutorial.classList.add('fadeIn');
	screenTutorial.classList.remove('fadeOut');
}

function setShareUrl() {
	const levelCurrent = mutations.getLevel();
	const score = mutations.getScore(); 

	if (mutations.areLevelsFinished()) {
		shareUrl = `I have finished @Palette at level ${levelCurrent + 1} with ${score} points!!! Can you make it better?`;
	} else {
		shareUrl = `I have overcome all the levels of @Palette with ${score} points  at level ${levelCurrent + 1}!!!`;
	}
}

function handPlay() {
	if (playEnabled) {
		if (mutations.areLevelsFinished()) {
			resetPage.classList.remove('hidden');
			return false;
		}
		homePage.classList.add('unveil');
		statusObserver.notify('playLevel');

		if (persist.getData('tutorialIsNotLaunched') !== 'false') {
			showTutorial();
		} else {
			showGame();
		}
		playEnabled = false;
	}
}

function handRate() {
	if (isMobile === 'Android') {
		window.location.replace(config.store.android);
	} else if (isMobile === 'iOS') {
		openUrl(config.store.ios);
	}
}

function handEvents() {
	playButton.addEventListener('click', handPlay);
	rateButton.addEventListener('click', handRate);

	shareLink.addEventListener('click', function() {
		openUrl(`${config.tweet.pref}${shareUrl}${config.tweet.suf}`);
	});
}

function init() {
	statusObserver.subscribe(function(status) {
		if (status === 'showHome') {
			showHome();
			setShareUrl();
		}
	});
	handEvents();
}

export default {
	init,
}