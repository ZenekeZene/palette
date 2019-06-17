import { constants, mutations, actions, config } from '../common';
const statusObserver = constants.statusObserver;
const finalPage = document.getElementById('finalPage');
const control = document.getElementById('control');
const livesOutMessage = document.getElementById('livesOutMessage');
const gameEndMessage = document.getElementById('gameEndMessage');
const backButton = document.getElementById('backButtonFinal');
const shareLinkFinal = document.getElementsByClassName('js-share-link');
let shareUrlFinal;

function setFinalMessage(isGameCompleted) {
	let textTweet = '';
	const levelCurrent = mutations.getLevel();
	const score = mutations.getScore();
	
	if (!isGameCompleted) {
		textTweet = `I+have+finished+@PlayPalette+with+${score}+points+at+level+${levelCurrent}!!!`;
		livesOutMessage.classList.remove('hidden');
		gameEndMessage.classList.add('hidden');
	} else {
		textTweet = `I+have+overcome+all+the+levels+of+@PlayPalette+with+${score}+points!!!`;
		livesOutMessage.classList.add('hidden');
		gameEndMessage.classList.remove('hidden');
	}
	shareUrlFinal = `${config.tweet.pref}${textTweet}${config.tweet.suf}`;
}

function showFinalPage(isGameCompleted) {
	control.classList.add('hidden');
	finalPage.classList.remove('hidden');
	finalPage.classList.add('fadeIn');
	setFinalMessage(isGameCompleted);
}

function shareUrl() {
	openUrl(shareUrlFinal);
}

function handEvents() {
	for (let i = 0; i < shareLinkFinal.length - 1; i++) {
		shareLinkFinal[i].addEventListener('click', shareUrl);
	}
	backButton.addEventListener('click', function() {
		app.classList.add('hidden');
		finalPage.classList.add('hidden');
		finalPage.classList.remove('fadeIn');

		statusObserver.notify('showHome');
		statusObserver.notify('cleanLevel');
		statusObserver.notify('showRecord');
		statusObserver.notify('backButton');
		actions.resetState();
	});
}

function init() {
	statusObserver.subscribe(function(status, data) {
		if (status === 'showFinalPage') {
			const isGameCompleted = data[0];
			showFinalPage(isGameCompleted);
		}
	});
	handEvents();
}

export default {
	init,
}