<template>
	<aside class="final">
		<header class="header">
			<p @click="back()" class="header__back"></p>
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
		<div class="confetti">
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
		</div>
	</aside>
</template>
<script>
import { mapState } from 'vuex';

export default {
	name: 'Final',
	computed: {
		...mapState([
			'level',
			'score',
		]),
	},
	data() {
		return {
			isCompleted: false,
		};
	},
	mounted() {
		this.isCompleted = this.$route.params.isCompleted;
	},
	methods: {
		back() {
			this.$router.push({ name: 'home' });
		},
	},
};
</script>

