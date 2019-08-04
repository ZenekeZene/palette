<template>
	<aside @click="skipTutorial" class="screentutorial">
		<div class="screentutorial-text">MIX THE COLORS TO MATCH THE SAMPLES</div>
		<div class="screentutorial-graphic">
			<div class="screentutorial-graphic__swatch"></div>
			<div class="screentutorial-graphic__mixer"></div>
			<div class="screentutorial-graphic__active"></div>
			<div class="screentutorial-graphic__base"></div>
		</div>
		<a class="screentutorial-next">That's all! Shall we get started?</a>
	</aside>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	name: 'Tutorial',
	methods: {
		...mapMutations([
			'setTutorialIsLaunched',
		]),
		skipTutorial() {
			this.$router.push({ name: 'game', });
			this.setTutorialIsLaunched({ status : true });
		},
	},
};
</script>

