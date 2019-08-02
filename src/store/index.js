import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const _ = require('lodash');

const constants = {
	levels: [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	scorePerSuccess: 10,
};

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		lives: 3,
		score: 0,
		level: 0,
		bonus: 0,
		tutorialIsLaunched: false,
		swatches: [],
		dropzones: [],
		activeColor: {},
	},
	getters: {
		areLevelsFinished: (state) => state.level === constants.levels.length - 1,
		getSwatchByIndex: (state) => (index) => state.swatches[index],
		getDropzoneByIndex: (state) => (index) => state.dropzones[index],
		getSwatchesCount: (state) => state.swatches.length,
		getSwatchesEnabled: (state) => state.swatches.filter(swatch => swatch.isEnabled === true),
		getSwatchesEnabledCount: (state, getters) => getters.getSwatchesEnabled.length,
		getRandomSwatchIndexEnabled: (state, getters) => getters.getSwatchesEnabledCount > 0 ? _.sample(getters.getSwatchesEnabled).index : -1,
	},
	mutations: {
		incrementLive(state) {
			state.lives++;
			localStorage.setItem('lives', state.lives);
		},
		decreaseLive(state) {
			state.lives--;
			localStorage.setItem('lives', state.lives);
		},
		incrementScore(state) {
			state.score += constants.scorePerSuccess;
			localStorage.setItem('score', state.score);
		},
		incrementLevel(state) {
			state.level++;
			localStorage.setItem('level', state.level);
		},
		resetLevel(state) {
			state.level = 0;
			localStorage.setItem('level', state.level);
		},
		incrementBonus(state) {
			state.bonus++;
			localStorage.setItem('bonus', state.bonus);
		},
		decreaseBonus(state) {
			state.bonus--;
			localStorage.setItem('bonus', state.bonus);
		},
		setTutorialIsLaunched(state, payload) {
			state.tutorialIsLaunched = payload.status;
			localStorage.setItem('tutorialIsLaunched', payload.status);
		},
		setSwatches(state, payload) {
			state.swatches = [];
			state.swatches = payload.swatches;
		},
		setDropzones(state, payload) {
			state.dropzones = payload.dropzones;
		},
		setActiveColor(state, payload) {
			state.activeColor = payload.activeColor;
			console.log(state.activeColor);
		},
		setDropzoneCMYKByIndex(state, payload) {
			state.dropzones[payload.index].cmyk = payload.cmyk;
		},
		setSwatchDisabledByIndex(state, payload) {
			state.swatches[payload.index].isEnabled = payload.isEnabled;
		},
	},
});

export default store;
