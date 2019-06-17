import { constants, mutations, actions } from '../common';
const statusObserver = constants.statusObserver;

const bonusWrapper = document.getElementById('bonusWrapper');
const bonusButton = document.getElementById('bonusButton');
let timerId;
let bonusCheck = 0;

function useBonus() {
	actions.decreaseBonus();
	showBonus();
	statusObserver.notify('bonusUsed');
}

function showBonus() {
	const bonus = mutations.getBonus();
	if (bonus <= 0) {
		bonusWrapper.classList.add('hidden');
	} else {
		bonusWrapper.classList.remove('hidden');
	}
}

function checkIsBonus(index) {
	clearTimeout(timerId);
	timerId = setTimeout(function() {
		bonusCheck = false;
	}, constants.intervalBonus);

	if (bonusCheck === false) {
		bonusCheck = true;
		return false;
	} else if (bonusCheck) {
		actions.increaseBonus();
		statusObserver.notify('showCombo', index);
		bonusCheck = false;
	}
	bonusCheck = true;
}

function init() {
	statusObserver.subscribe(function(status, data) {
		if (status === 'stepSuccess') {
			checkIsBonus(data[0]);
			showBonus();
		} else if (status == 'playLevel') {
			showBonus();
		}
	});
	
	bonusButton.addEventListener('touchstart', function() {
		if (mutations.getBonus() > 0) {
			useBonus();
		}
	});

	showBonus();
}

export default {
	init,
};