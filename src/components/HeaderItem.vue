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
import { mapState, mapGetters, mapMutations } from 'vuex';
import { EventBus } from '../scripts/EventBus.js';

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
		...mapMutations(['setPlayingMusic']),
		back() {
			this.$router.push('/home');
			EventBus.$emit('stopMusic');
			this.setPlayingMusic({ isPlayingMusic: false });
		},
	},
};
</script>

