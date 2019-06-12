import persist from './persist';
let statusObserver;
let contBonus = 0;
const bonusNode = document.getElementById('bonusText');
let timerId;
const INTERVAL = 1200; // ms

function incrementBonus() {
	contBonus++;
	saveBonus();
	updateBonus();
}

function updateBonus() {
	bonusNode.textContent = contBonus;
}

function saveBonus() {
	persist.saveData('bonus', contBonus);
}

function init(statusObserverEntry) {
	statusObserver = statusObserverEntry;
	let cont = 0;
	statusObserver.subscribe(function(status, data) {
		if (status === 'success') {
			timerId = setTimeout(() => {
				if (cont === 0) {
					cont = 1;
				}
			}, 1200);

			if (cont === 1) {
				console.log('Bonus');
			}
		}
	});
}

const bonus = {
	init,
	incrementBonus,
} 

export default bonus;