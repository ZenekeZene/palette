import persist from './persist';
let statusObserver;
const homeHighScore = document.getElementById('homeHighScore');
const highLevel = document.getElementById('highLevel');
const highScore = document.getElementById('highScore');

function getRecord() {
	let items = [0, 0];
	const record = persist.getData('record');
	if (record) {
		items = record.split('|');
	}
	return {
		levelRecord: Number(items[0]),
		scoreRecord: Number(items[1]),
	};
}

function handRecord(levelCurrent, contSuccessTotal) {
	const {levelRecord, scoreRecord } = getRecord();
	if (levelRecord) {
		homeHighScore.classList.remove('hidden');
		if (levelCurrent > levelRecord) {
			saveRecord(levelCurrent, contSuccessTotal);
		} else if (levelCurrent == levelRecord) {
			if (contSuccessTotal > scoreRecord) {
				saveRecord(levelCurrent, contSuccessTotal);
			}
		}
	} else {
		saveRecord(levelCurrent, contSuccessTotal);
	}
}

function saveRecord(levelCurrent, contSuccessTotal) {
	persist.saveData('record', `${levelCurrent + 1}|${contSuccessTotal}`);
	updateRecord(levelCurrent, contSuccessTotal);
}

function showRecord() {
	const {levelRecord, scoreRecord} = getRecord();
	if (levelRecord) {
		updateRecord(levelRecord, scoreRecord);
		homeHighScore.classList.remove('hidden');
	}
}

function updateRecord(level, score) {
	highLevel.textContent = level;
	highScore.textContent = score;
}

function init(statusObserverEntry) {
	statusObserver = statusObserverEntry;
	statusObserver.subscribe(function(status, data) {
		if (status === 'handRecord') {
			handRecord(data[0].levelCurrent, data[0].contSuccessTotal);
		} else if (status === 'showRecord') {
			showRecord();
		}
	});
	showRecord();
}

export default {
	init,
}