<template>
	<div class="swatch"
		:class="classTrigger"
		:style="{ backgroundColor: colorRender }"
	><slot></slot></div>
</template>
<script>
import color from '../scripts/color';

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
		classTrigger: {
			type: String,
			default: '',
		},
	},
	computed: {
		colorRender() {
			return color.getRGBColor(color.convertCMYKtoRGB(this.cmyk));
		},
	},
};
</script>

