<template>
	<header class="header">
		<p v-if="noBack === false" class="header__back" @click="back"></p>
		<p class="header__level">LEVEL&nbsp;
			<span>{{ displayLevel }}</span>
		</p>
		<p class="header__score">{{ score }}</p>
		<p class="header__lives">{{ lives }}</p>
	</header>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

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
		...mapGetters([
			'displayLevel',
		]),
	},
	props: {
		noBack: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		back() {
			this.$router.push('/home');
		},
	},
};
</script>

