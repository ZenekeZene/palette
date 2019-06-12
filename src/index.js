import game from './scripts/game';
import persist from './scripts/persist'
import Observable from './scripts/Observer'
import './styles/styles.scss'

if (process.env.NODE_ENV !== 'production') {
	require('./index.pug');
} 

function init () {
	const levels = [1, 2, 3];
	let levelCurrent = parseInt(persist.getData('levelCurrent'), 10) || 0;
	const statusObserver = new Observable();
	game.init(statusObserver, levels, levelCurrent);
}

document.addEventListener('DOMContentLoaded', function () {
	init();
});