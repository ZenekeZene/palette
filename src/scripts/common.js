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
	_isDev: false,
}

export const constants = {
	livesInitial: 3,
	levels: [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	lifePrizes: [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 5, 5, 5, 8],
	scorePerSuccess: 10,
	intervalBonus: 2200, // ms
	statusObserver: new Observable(),
};

export const binding = Bind(
	{
		lives: Number(persist.getData('lives')) || constants.livesInitial,
		score: Number(persist.getData('score')) || 0,
		level: Number(persist.getData('level')) || 0,
		bonus: Number(persist.getData('bonus')) || 0,
	}, {
		lives: '#lives',
		score: '#score',
		level: {
			dom: '#level',
			transform: function(value) {
				return value + 1;
			},
		},
		bonus: '#bonusText',
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
	getBonus: function() {
		return binding.bonus;
	},
	setBonus: function(value) {
		binding.bonus = value;
		persist.saveData('bonus', value);
	},
	areLevelsFinished: function() {
		return binding.level === constants.levels.length - 1;
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
	},
	increaseBonus: function() {
		const bonus = mutations.getBonus() + 1;
		mutations.setBonus(bonus);
		return bonus;
	},
	decreaseBonus: function() {
		const bonus = mutations.getBonus() - 1;
		mutations.setBonus(bonus);
		return bonus;
	},
	resetState: function() {
		persist.saveData('tutorialIsNotLaunched', true);
		mutations.setLives(constants.livesInitial);
		mutations.setLevel(0);
		mutations.setScore(0);
		mutations.setBonus(0);
	},
}
