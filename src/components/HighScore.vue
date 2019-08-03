<template>
	<article class="home-highscore">
		<header class="highscore__title">HI SCORE</header>
		<section class="highscore__body">
			<p class="header__level">LEVEL <span>{{ highScore.level }}</span></p>
			<p class="header__score">{{ highScore.score }}</p>
			<a class="header__share">SHARE</a>
		</section>
	</article>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'HighScore',
	computed: {
		...mapState([
			'highScore',
		]),
	},
};
</script>

