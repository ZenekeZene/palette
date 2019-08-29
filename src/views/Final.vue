<template>
	<article>
		<header class="header">
			<p @click="back" class="header__back"></p>
		</header>
		<section class="final-message game-end" v-if="isCompleted">
			<h2>Congratulations!</h2>
			<h3>You have overcome all the levels of Palette with <span>{{ score }}</span></h3>
			<a class="header__share"
				@click="openLink(mountTweet(`I+have+overcome+all+the+levels+of+@PlayPalette+with+${ score }+points!!!`))"
			>SHARE YOUR RECORD</a>
		</section>
		<section class="final-message" v-else>
			<h2>Well done!</h2>
			<h3>You have finished Palette with <span>{{ score }} points at level</span></h3>
			<p><span>{{ level }}</span></p>
			<a class="header__share"
				@click="openLink(mountTweet(`I+have+finished+@PlayPalette+with+${ score }+points+at+level+${ displayLevel }!!!`))">
			>SHARE YOUR RECORD</a>
		</section>
		<confetti-decorator></confetti-decorator>
	</article>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
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
		...mapGetters([
			'displayLevel',
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
			if (this.level > this.highScore.level ||
				(this.level === this.highScore.level && this.score > this.highScore.score)) {
				this.$store.commit('setHighScore', { level: this.level, score: this.score });
			}
		}
	},
};
</script>
