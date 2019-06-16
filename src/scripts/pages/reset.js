import { constants, actions } from '../common';
const statusObserver = constants.statusObserver;

const resetPage = document.getElementById('resetPage');
const resetCancel = document.getElementById('resetCancel');
const resetAccept = document.getElementById('resetAccept');
const resetButton = document.getElementById('resetButton');

function reset() {
	actions.resetState();
	location.reload();
}

function handEvents() {
	resetButton.addEventListener('click', function() {
		resetPage.classList.remove('hidden');
	});

	resetCancel.addEventListener('click', function() {
		resetPage.classList.add('hidden');
	});

	resetAccept.addEventListener('click', function() {
		resetPage.classList.add('hidden');
		reset();
	});
}

function init() {
	handEvents();
	statusObserver.subscribe(function(status) {
		if (status === 'reset') {
			reset();
		}
	});
}

export default {
	init,
}