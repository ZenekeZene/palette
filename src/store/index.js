import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const _ = require('lodash');

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	plugins: [createPersistedState({
		key: 'palette-state',
	})],
	state: {
		lives: 3,
		score: 0,
		level: 0,
		bonus: 0,
		tutorialIsLaunched: false,
		swatches: [],
		dropzones: [],
		activeColor: null,
		highScore: {
			level: 0,
			score: 0,
		},
	},
	getters: {
		displayLevel: (state) => (state.level + 1).toString(),
		areLevelsFinished: (state) => state.level === config.levels.length - 1,
		getSwatchByIndex: (state) => (index) => state.swatches[index],
		getDropzoneByIndex: (state) => (index) => state.dropzones[index],
		getSwatchesCount: (state) => state.swatches.length,
		getSwatchesEnabled: (state) => state.swatches.filter((swatch) => swatch.isEnabled),
		getSwatchesEnabledCount: (state, getters) => getters.getSwatchesEnabled.length,
		getRandomSwatchIndexEnabled: (state, getters) =>
			getters.getSwatchesEnabledCount > 0 ? _.sample(getters.getSwatchesEnabled).index : -1,
		getLivesToWinByLevel: (state) => config.lifePrizes[state.level],
		wasTheLastLevel: (state) => state.level + 1 === config.levels.length,
	},
	mutations: {
		incrementLive(state) {
			state.lives += config.lifePrizes[state.level];
		},
		decreaseLive(state) {
			state.lives--;
		},
		incrementScore(state) {
			state.score += config.scorePerSuccess;
		},
		incrementLevel(state) {
			state.level++;
		},
		resetDisplay(state) {
			state.level = 0;
			state.score = 0;
			state.bonus = 0;

			state.swatches = [];
			state.dropzones = [];
			state.activeColor = null;
		},
		resetGame(state) {
			state.swatches = [];
			state.dropzones = [];
			state.activeColor = null;
		},
		incrementBonus(state) {
			state.bonus++;
		},
		decreaseBonus(state) {
			state.bonus--;
		},
		setTutorialIsLaunched(state, payload) {
			state.tutorialIsLaunched = payload.status;
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
		},
		setDropzoneCMYKByIndex(state, payload) {
			state.dropzones[payload.index].cmyk = payload.cmyk;
		},
		setSwatchDisabledByIndex(state, payload) {
			state.swatches[payload.index].isEnabled = payload.isEnabled;
		},
		setDropzoneDisabledByIndex(state, payload) {
			state.dropzones[payload.index].isEnabled = payload.isEnabled;
		},
		setHighScore(state, payload) {
			state.highScore.level = payload.level;
			state.highScore.score = payload.score;
		},
	},
});

export default store;
