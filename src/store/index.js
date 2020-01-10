import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const _ = require('lodash');

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	plugins: [
		createPersistedState({
			key: 'palette-state',
		}),
	],
	state: {
		lives: config.initialState.lives,
		score: config.initialState.score,
		level: config.initialState.level,
		bonus: config.initialState.bonus,
		tutorialIsLaunched: config.initialState.tutorialIsLaunched,
		swatches: config.initialState.swatches,
		dropzones: config.initialState.dropzones,
		activeColor: config.initialState.activeColor,
		highScore: config.initialState.highScore,
		isMuted: config.initialState.isMuted,
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
		getLivesToWinByLevel: (state) => config.prizes[state.level].l,
		getBonusToWinByLevel: (state) => config.prizes[state.level].b,
		wasTheLastLevel: (state) => state.level + 1 === config.levels.length,
	},
	mutations: {
		givePrizes(state) {
			console.log(config.prizes[state.level]);
			state.lives += config.prizes[state.level].l;
			state.bonus += config.prizes[state.level].b;
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
			state.level = config.initialState.level;
			state.score = config.initialState.score;
			state.bonus = config.initialState.bonus;
			state.lives = config.initialState.lives;

			state.swatches = config.initialState.swatches;
			state.dropzones = config.initialState.dropzones;
			state.activeColor = config.initialState.activeColor;
		},
		resetGame(state) {
			state.swatches = config.initialState.swatches;
			state.dropzones = config.initialState.dropzones;
			state.activeColor = config.initialState.activeColor;
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
		setIsMuted(state, payload) {
			state.isMuted = payload.isMuted;
		},
	},
});

export default store;
