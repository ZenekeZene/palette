import { actions } from '../common';

const resetPage = document.getElementById('resetPage');
const resetCancel = document.getElementById('resetCancel');
const resetAccept = document.getElementById('resetAccept');
const resetButton = document.getElementById('resetButton');

function handEvents() {
	resetButton.addEventListener('click', function() {
		resetPage.classList.remove('hidden');
	});

	resetCancel.addEventListener('click', function() {
		resetPage.classList.add('hidden');
	});

	resetAccept.addEventListener('click', function() {
		resetPage.classList.add('hidden');
		actions.resetState();
		location.reload();
	});
}

function init() {
	handEvents();
}

export default {
	init,
}