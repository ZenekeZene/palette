import persist from './tools/persist';
import Observable from './core/Observer';
import Bind from 'bind.js';

export const config = {
	tweet: {
		pref: 'https://twitter.com/intent/tweet?text=',
		suf: '+http://palette.ws',
	},
	stores: {
		android: 'market://details?id=com.pilpilgames.palette',
		ios: 'https://itunes.apple.com/app/id1467492943',
	},
}

export const constants = {
	livesInitial: 3,
	levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	lifePrizes: [1, 1, 2, 2, 3, 3, 5, 5, 8, 8, 13, 13, 21, 21],
	scorePerSuccess: 10,
	intervalBonus: 2200, // ms
	statusObserver: new Observable(),
};

export const binding = Bind(
	{
		lives: Number(persist.getData('lives')) || constants.livesInitial,
		score: Number(persist.getData('score')) || 0,
		level: Number(persist.getData('level')) || 0,
	}, {
		lives: '#lives',
		score: '#score',
		level: {
			dom: '#level',
			transform: function(value) {
				return value + 1;
			},
		}
	}
);

export let mutations = {
	getLives: function() {
		return binding.lives;
	},
	setLives: function(value) {
		binding.lives = value;
		persist.saveData('lives', value);
	},
	getScore: function() {
		return binding.score;
	},
	setScore: function(value) {
		binding.score = value;
		persist.saveData('score', value);
	},
	getLevel: function() {
		return binding.level;
	},
	setLevel: function(value) {
		binding.level = value;
		persist.saveData('level', value);
	},
	areLevelsFinished: function() {
		return binding.lives === constants.levels.length - 1;
	},
};

export const actions = {
	increaseLife: function() {
		const lives = mutations.getLives() + constants.lifePrizes[mutations.getLevel()];
		mutations.setLives(lives);
		return lives;
	},
	decreaseLife: function() {
		const lives = mutations.getLives() - 1;
		mutations.setLives(lives);
		return lives;
	},
	increaseScore: function() {
		const score = mutations.getScore() + constants.scorePerSuccess;
		mutations.setScore(score);
		return score;
	},
	increaseLevel: function() {
		const level = mutations.getLevel() + 1;
		mutations.setLevel(level);
		return level;
	}
}