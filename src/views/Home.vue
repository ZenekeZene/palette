<template>
	<aside class="home">
		<aside class="home-header">
			<h1 class="home-title nunito-9">THE <span class="color">COLOR</span> ALCHEMIST</h1>

		</aside>
		<img src="/img/pet.png" alt="Ilustration" class="home-image" />
		<nav class="home-buttons">
			<button @click="handGame" class="home-buttons__play button">Jugar</button>
			<button @click="handRate" class="home-buttons__rate button">Ranking</button>
		</nav>
		<high-score v-if="highScore.level"></high-score>
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
