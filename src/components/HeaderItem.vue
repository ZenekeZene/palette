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
import { mapState } from 'vuex';

export default {
	name: 'HeaderItem',
	data() {
		return {
			highLevel: 0,
		};
	},
	computed: {
		...mapState([
			'lives',
			'score',
			'level',
		]),
	},
	props: {
		noBack: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

