export default {
	tweet: {
		pref: 'https://twitter.com/intent/tweet?text=',
		suf: '+http://palette.ws',
	},
	stores: {
		android: 'market://details?id=com.pilpilgames.palette',
		ios: 'https://itunes.apple.com/app/id1467492943',
	},
	_isDev: false,
	levels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	lifePrizes: [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 5, 5, 5, 8],
	scorePerSuccess: 10,
	intervalBonus: 2200, // ms
	initialState: {
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
		isMuted: false,
	},
};
