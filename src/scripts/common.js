import persist from './tools/persist';
import Observable from './core/Observer';

export const constants = {
	livesInitial: 3,
	levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	lifePrizes: [1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 13, 13, 21, 21],
	scorePerSuccess: 10,
	intervalBonus: 2200, // ms
	statusObserver: new Observable(),
};

export const state = {
	levelCurrent: parseInt(persist.getData('levelCurrent'), 10) || 0,
	score: Number(persist.getData('contSuccessTotal')) || 0,
}