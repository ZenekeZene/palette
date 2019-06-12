import persist from './persist';
let statusObserver;
let contBonus = 0;
const bonusWrapper = document.getElementById('bonusWrapper');
const bonusText = document.getElementById('bonusText');
const bonusButton = document.getElementById('bonusButton');
let timerId;
let bonusCheck = 0;
const INTERVAL = 2200; // ms

function increaseBonus() {
	contBonus += 1;
	updateBonus();
	saveBonus();
}

function decreaseBonus() {
	contBonus -= 1;
	console.log(contBonus);
	updateBonus();
	//saveBonus();
}

function useBonus() {
	decreaseBonus();
	statusObserver.notify('bonusUsed');
}

function updateBonus() {
	bonusText.innerHTML = contBonus;
	if (contBonus <= 0) {
		bonusWrapper.classList.add('hidden');
	} else {
		bonusWrapper.classList.remove('hidden');
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
		increaseBonus();
		bonusCheck = false;
	}
	bonusCheck = true;
}

function init(statusObserverEntry) {
	statusObserver = statusObserverEntry;
	statusObserver.subscribe(function(status, data) {
		if (status === 'stepSuccess') {
			checkIsBonus();
		} else if (status === 'playLevel') {
			contBonus = Number(persist.getData('bonus')) || 0;
			updateBonus();
		}
	});
	
	bonusButton.addEventListener('touchstart', function() {
		if (contBonus) {
			useBonus();
		}
	});
}

const bonus = {
	init,
} 

export default bonus;