<template>
	<header class="header">
		<p id="backButton" v-if="noBack === false" class="header__back"></p>
		<p class="header__level">LEVEL&nbsp;
			<span>{{ level }}</span>
		</p>
		<p class="header__score">{{ score }}</p>
		<p class="header__lives">{{ lives }}</p>
	</header>
</template>
<script>
import { mutations } from '../scripts/common';

export default {
	name: 'HeaderItem',
	data() {
		return {
			lives: mutations.getLives(),
			score: mutations.getScore(),
			level: mutations.getLevel(),
			highLevel: 0,
		};
	},
	props: {
		noBack: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

