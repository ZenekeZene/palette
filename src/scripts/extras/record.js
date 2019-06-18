import persist from '../tools/persist';
import { constants, mutations } from '../common';

let statusObserver = constants.statusObserver;

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

function handRecord() {
	const levelCurrent = mutations.getLevel();
	const score = mutations.getScore();
	const {levelRecord, scoreRecord } = getRecord();
	if (levelRecord) {
		homeHighScore.classList.remove('invisible');
		if (levelCurrent > levelRecord) {
			saveRecord(levelCurrent, score);
		} else if (levelCurrent == levelRecord) {
			if (score > scoreRecord) {
				saveRecord(levelCurrent, score);
			}
		}
	} else {
		saveRecord(levelCurrent, score);
	}
}

function saveRecord(levelCurrent, score) {
	persist.saveData('record', `${levelCurrent + 1}|${score}`);
	updateRecord(levelCurrent, score);
}

function showRecord() {
	const { levelRecord, scoreRecord } = getRecord();
	if (levelRecord > 0) {
		updateRecord(levelRecord, scoreRecord);
		homeHighScore.classList.remove('invisible');
	}
}

function updateRecord(level, score) {
	highLevel.textContent = level;
	highScore.textContent = score;
}

function init() {
	statusObserver.subscribe(function(status) {
		if (status === 'handRecord') {
			handRecord();
		} else if (status === 'showRecord') {
			showRecord();
		}
	});
	showRecord();
}

export default {
	init,
	getRecord,
}