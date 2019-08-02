<template>
	<div class="progression level-1" :class="`level-${level}`">
		<p class="progression__text">Game progression:
			<span>&ensp;&ensp;&ensp;</span>
		</p>
		<div class="progression__graphic">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';

export default {
	name: 'ProgressionDecorator',
	computed: {
		...mapState([
			'level'
		]),
	},
};
</script>
