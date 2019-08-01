<template>
<transition name="fade">
	<aside class="home">
		<aside class="home-header">
			<div class="home-header__logo">
				<img src="img/logo.svg" alt="Palette logo" height="50">
			</div>
			<header-item noBack></header-item>
		</aside>
		<nav class="home-buttons">
			<router-link to="game" class="home-buttons__play"></router-link>
			<button @click="handRate" class="home-buttons__rate"></button>
			<button id="soundButton" class="home-buttons__sound"></button>
			<button @click="launchReset" class="home-buttons__reset"></button>
			<router-link to="credits" class="home-buttons__about"></router-link>
			<a id="eulaButton" class="home-buttons__eula" @click="openUrl('http://palette.ws/legal.html')" href="#"></a>
		</nav>
		<high-score></high-score>
		<a class="donate-button" onclick="openUrl('https://www.buymeacoffee.com/PilPilGames')" href="#"></a>
		<reset-modal :adaptive="true"></reset-modal>
	</aside>
</transition>
</template>

<script>
import ResetModal from '../components/ResetModal';
import HeaderItem from '../components/HeaderItem';
import HighScore from '../components/HighScore';
import { mapState } from 'vuex';

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
		};
	},
	methods: {
		launchReset() {
			this.$modal.show('reset-modal');
		},
		handRate() {
			if (isMobile === 'Android') {
				window.location.replace(config.stores.android);
			} else if (isMobile === 'iOS') {
				openUrl(config.stores.ios);
			}
		},
	},
};
</script>
