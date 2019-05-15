import './styles/styles.scss';
import 'animate.css';
const game = require('./lib/game');
const ui = require('./lib/ui');
import Observable from './lib/Observer';

function init() {
	const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	const statusObserver = new Observable();
	const app = document.getElementById('app');
	game.setup(app, statusObserver, levels);
	ui.init(statusObserver, levels);
}

document.addEventListener('DOMContentLoaded', function(event) {
	init();
})