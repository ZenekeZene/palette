import { constants, state } from '../common';
const levelCurrent = state.levelCurrent;
const score = state.score;
const  statusObserver = constants.statusObserver;

const finalPage = document.getElementById('finalPage');
const control = document.getElementById('control');
const countSuccessfulFinal = document.getElementsByClassName('js-contSuccessfulFinalPage');
const livesOutMessage = document.getElementById('livesOutMessage');
const levelCurrentFinal = document.getElementById('levelCurrentFinal');
const gameEndMessage = document.getElementById('gameEndMessage');
const shareLinkFinal = document.getElementById('shareLink');
const shareLinkFinalCompleted = document.getElementById('shareLinkFinalCompleted');
let shareUrlFinal, shareUrlFinalCompleted;

function setFinalMessage(isGameCompleted) {
	let textTweet = '';
	if (!isGameCompleted) {
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

function showFinalPage(isGameCompleted) {
	control.classList.add('hidden');
	finalPage.classList.remove('hidden');
	finalPage.classList.add('fadeIn');

	for(let i = 0; i < countSuccessfulFinal.length; i++) {
		countSuccessfulFinal[i].textContent = score;
	}
	levelCurrentFinal.textContent = levelCurrent + 1;

	setFinalMessage(isGameCompleted);
}

function handEvents() {
	shareLinkFinal.addEventListener('click', function() {
		openUrl(`https://twitter.com/intent/tweet?text=${shareUrlFinal}`);
	});

	shareLinkFinalCompleted.addEventListener('click', function() {
		openUrl(`https://twitter.com/intent/tweet?text=${shareUrlFinalCompleted}`);
	});
}

function init() {
	statusObserver.subscribe(function(status, data) {
		if (status === 'showFinalPage') {
			const { isGameCompleted } = data[0];
			showFinalPage(isGameCompleted);
		}
	});
	handEvents();
}

export default {
	init,
}