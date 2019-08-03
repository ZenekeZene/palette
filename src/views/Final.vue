<template>
	<aside>
		<header class="header">
			<p @click="back" class="header__back"></p>
		</header>
		<div class="final-message game-end" v-if="isCompleted">
			<h2>Congratulations!</h2>
			<h3>You have overcome all the levels of Palette with
				<span>{{ score }}</span>
			</h3>
			<a class="header__share">SHARE YOUR RECORD</a>
		</div>
		<div class="final-message" v-else>
			<h2>Well done!</h2>
			<h3>You have finished Palette with {{ score }}
				<span>points at level</span>
			</h3>
			<p><span>{{ level }}</span></p>
			<a class="header__share">SHARE YOUR RECORD</a>
		</div>
		<confetti-decorator></confetti-decorator>
	</aside>
</template>
<script>
import { mapState } from 'vuex';
import ConfettiDecorator from '../components/ConfettiDecorator';

export default {
	name: 'Final',
	components: {
		ConfettiDecorator,
	},
	computed: {
		...mapState([
			'level',
			'score',
			'highScore'
		]),
	},
	data() {
		return {
			isCompleted: false,
		};
	},
	mounted() {
		this.isCompleted = this.$route.params.isCompleted;
		this.calculateHighScore();
	},
	methods: {
		back() {
			this.$store.commit('resetDisplay');
			this.$router.push('/home');
		},
		calculateHighScore() {
			if (this.level > this.highScore.level) {
				this.$store.commit('setHighScore', { level: this.level, score: this.score });
			} else if (this.level > this.highScore.level) {
				if (this.score > this.highScore.record) {
					this.$store.commit('setHighScore', { level: this.level, score: this.score });
				}
			}
		}
	},
};
</script>
