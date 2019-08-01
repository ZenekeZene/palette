<template>
	<div class="swatch" 
		:class="{ 'tutorial': tutorialIsLaunched }"
		:style="{ backgroundColor: colorRender }"
	>{{ cmyk }}
	</div>
</template>
<script>
import { mapState } from 'vuex';
import color from '../scripts/core/color';

export default {
	name: 'ColorChip',
	data() {
		return {
			isEnabled: true,
		};
	},
	props: {
		index: {
			type: Number,
			default: 0,
		},
		cmyk: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		...mapState([
			'tutorialIsLaunched',
		]),
		colorRender() {
			return color.getRGBColor(color.convertCMYKtoRGB(this.cmyk));
		},
	},
};
</script>

