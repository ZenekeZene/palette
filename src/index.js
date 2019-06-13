import game from './scripts/core/game';
import './styles/styles.scss';

if (process.env.NODE_ENV !== 'production') {
	require('./index.pug');
} 

function init () {
	game.init();
}

document.addEventListener('DOMContentLoaded', function () {
	init();
});