<template>
<aside id="homePage" class="home">
	<aside class="home-header">
		<div class="home-header__logo">
			<img src="img/logo.svg" alt="Palette logo" height="50">
		</div>
		<header-item noBack></header-item>
	</aside>
	<nav class="home-buttons">
		<router-link to="game" class="home-buttons__play"></router-link>
		<button id="rateButton" class="home-buttons__rate"></button>
		<button id="soundButton" class="home-buttons__sound"></button>
		<button @click="launchReset" class="home-buttons__reset"></button>
		<router-link to="credits" class="home-buttons__about"></router-link>
		<a id="eulaButton" class="home-buttons__eula" @click="openUrl('http://palette.ws/legal.html')" href="#"></a>
	</nav>
	<high-score></high-score>
	<a class="donate-button" onclick="openUrl('https://www.buymeacoffee.com/PilPilGames')" href="#"></a>
	<reset-modal :adaptive="true"></reset-modal>
</aside>
</template>

<script>
import ResetModal from './ResetModal';
import HeaderItem from './HeaderItem';
import HighScore from './HighScore';
import { mutations } from '../scripts/common';

export default {
	name: "HomePage",
	components: {
		ResetModal,
		HighScore,
		HeaderItem,
	},
	data() {
		return {
			lives: mutations.getLives(),
			score: mutations.getScore(),
			level: mutations.getLevel(),
			highLevel: 0,
		};
	},
	methods: {
		launchReset() {
			this.$modal.show('reset-modal');
		},
	},
};
</script>