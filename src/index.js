import './styles/styles.scss';
import 'animate.css';
const game = require('./lib/game');
const persist = require('./lib/persist');
import Observable from './lib/Observer';

function init() {
	const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	let levelCurrent = parseInt(persist.getData('levelCurrent'), 10) || 0;
	const statusObserver = new Observable();
	game.init(statusObserver, levels, levelCurrent);
}

document.addEventListener('DOMContentLoaded', function() {
	init();
})