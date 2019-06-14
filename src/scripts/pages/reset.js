import { constants, mutations } from '../common';
import persist from '../tools/persist';

const statusObserver = constants.statusObserver;

const resetPage = document.getElementById('resetPage');
const resetCancel = document.getElementById('resetCancel');
const resetAccept = document.getElementById('resetAccept');
const resetButton = document.getElementById('resetButton');

function handEvents() {
	resetButton.addEventListener('click', function(event) {
		resetPage.classList.remove('hidden');
	});

	resetCancel.addEventListener('click', function(event) {
		resetPage.classList.add('hidden');
	});

	resetAccept.addEventListener('click', function(event) {
		resetPage.classList.add('hidden');
		persist.saveData('tutorialIsNotLaunched', true);
		mutations.setLives(constants.livesInitial);
		mutations.setLevel(0);
		mutations.setScore(0);
		location.reload();
	});
}

function init() {
	handEvents();
}

export default {
	init,
}