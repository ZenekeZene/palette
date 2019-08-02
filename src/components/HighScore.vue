<template>
	<article class="home-hiscore" v-if="highscore">
		<header class="hiscore__title">HI SCORE</header>
		<section class="hiscore__body">
			<p class="header__level">LEVEL <span>{{ highscore.level }}</span></p>
			<p class="header__score">{{ highscore.score }}</p>
			<p class="header__share">SHARE</p>
		</section>
	</article>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'HighScore',
	computed: {
		...mapState([
			'highscore',
		]),
	},
};
</script>

