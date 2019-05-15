import './styles/styles.scss';
import 'animate.css';
const game = require('./lib/game');
const ui = require('./lib/ui');
import Observable from './lib/Observer';

const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const statusObserver = new Observable();

// Hack for window height with navigation bars
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

document.addEventListener('DOMContentLoaded', function(event) {
	const app = document.getElementById('app');
	game.setup(app, statusObserver, levels);
	ui.init(statusObserver, levels);
})