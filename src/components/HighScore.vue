<template>
	<article class="home-high-score">
		<header class="high-score__title">HI SCORE</header>
		<section class="high-score__body">
			<p class="header__level">LEVEL <span>{{ highScore.level }}</span></p>
			<p class="header__score">{{ highScore.score }}</p>
			<a class="header__share"
				@click="openLink(mountTweet(`I+have+overcome+all+the+levels+of+@PlayPalette+with+${ highScore.score }+points!!!`))"
				v-if="areLevelsFinished"
			>SHARE</a>
			<a class="header__share"
				@click="openLink(mountTweet(`I+have+finished+@PlayPalette+with+${ highScore.score }+points+at+level+${ highScore.level }!!!`))"
				v-else
			>SHARE</a>
		</section>
	</article>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
	name: 'HighScore',
	computed: {
		...mapState([
			'highScore',
		]),
		...mapGetters([
			'areLevelsFinished',
		]),
	},
};
</script>

