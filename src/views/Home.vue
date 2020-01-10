<template>
	<aside class="home">
		<aside class="home-header">
			<div class="home-header__logo">
				<img :src="logo" alt="Palette logo" height="50">
			</div>
			<header-item noBack></header-item>
		</aside>
		<nav class="home-buttons">
			<button @click="handGame" class="home-buttons__play"></button>
			<button @click="handRate" class="home-buttons__rate"></button>
			<button @click="handSound" class="home-buttons__sound" :class="{'--silence': isMuted }"></button>
			<button @click="launchReset" class="home-buttons__reset"></button>
			<router-link to="credits" class="home-buttons__about"></router-link>
			<a id="eulaButton" class="home-buttons__eula" @click="openLink('http://palette.ws/legal.html')" href="#"></a>
		</nav>
		<high-score v-if="highScore.level"></high-score>
		<a class="donate-button" @click="openLink('https://www.buymeacoffee.com/PilPilGames')" href="#"></a>
		<reset-modal :adaptive="true"></reset-modal>
	</aside>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import config from '../config';
import Logo from '../img/logo.svg';
import ResetModal from '../components/ResetModal';
import HeaderItem from '../components/HeaderItem';
import HighScore from '../components/HighScore';

export default {
	name: "HomePage",
	components: {
		ResetModal,
		HighScore,
		HeaderItem,
	},
	data() {
		return {
			highLevel: 0,
			logo: Logo,
		};
	},
	computed: {
		...mapState([
			'highScore',
			'tutorialIsLaunched',
			'isMuted',
		]),
	},
	methods: {
		...mapMutations([
			'setIsMuted',
		]),
		launchReset() {
			this.$modal.show('reset-modal');
		},
		handRate() {
			if (isMobile === 'Android') {
				this.openLink(config.stores.android);
			} else if (isMobile === 'iOS') {
				this.openLink(config.stores.ios);
			}
		},
		handSound() {
			this.setIsMuted({ isMuted: !this.isMuted });
		},
		handGame() {
			if (!this.tutorialIsLaunched) {
				this.$router.push({ name: 'tutorial' });
			} else {
				this.$router.push({ name: 'game' });
			}
		}
	},
};
</script>
