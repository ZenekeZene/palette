import persist from './persist';
let statusObserver;
let contBonus = 0;
const bonusNode = document.getElementById('bonusText');
let timerId;
let bonusCheck = 0;
const INTERVAL = 3200; // ms

function incrementBonus() {
	contBonus++;
	saveBonus();
	updateBonus();
}

function updateBonus() {
	if (bonusNode) {
		bonusNode.textContent = contBonus;
	}
}

function saveBonus() {
	persist.saveData('bonus', contBonus);
}

function checkIsBonus() {
	clearTimeout(timerId);
	timerId = setTimeout(function() {
		bonusCheck = false;
	}, INTERVAL);

	if (bonusCheck === false) {
		bonusCheck = true;
		return false;
	} else if (bonusCheck) {
		incrementBonus();
		bonusCheck = false;
	}
	bonusCheck = true;
}

function init(statusObserverEntry) {
	statusObserver = statusObserverEntry;
	statusObserver.subscribe(function(status, data) {
		if (status === 'stepSuccess') {
			checkIsBonus();
		}
	});
}

const bonus = {
	init,
	incrementBonus,
} 

export default bonus;