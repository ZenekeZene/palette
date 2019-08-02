<template>
	<section id="app" class="game animated" :class="{ '--is-dev': isDev }">
		<header-item></header-item>
		<main>
			<section ref="swatchesGrid" class="swatches">
				<color-chip v-for="(swatch, index) in swatches" :key="index"
					:index=swatch.index
					:cmyk="swatch.cmyk"
					:data-index=swatch.index></color-chip>
			</section>
			<section ref="dropzonesGrid" id="dropzonesGrid" class="swatches mixer">
				<color-chip v-for="(dropzone, index) in dropzones" :key="index"
					:index=dropzone.index
					:cmyk="dropzone.cmyk"
					:data-index=dropzone.index></color-chip>
			</section>
		</main>
		<div ref="limitActive" class="limit-drag">
			<div ref="activeBase" class="active__base" :class="{ 'tutorial': tutorialIsLaunched }"></div>
			<color-chip
					v-if="activeColor"
					:cmyk=activeColor.cmyk
					class="active__swatch drag-drop active"></color-chip>
			<div class="bonus" @click="resetGame">
				<button class="bonus__button"></button>
				<button class="bonus__quantity">x1</button>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { constants } from '../scripts/common';
import { EventBus } from '../EventBus.js';
import drag from '../scripts/core/drag';
import color from '../scripts/core/color';
import bonus from '../scripts/extras/bonus';
import HeaderItem from '../components/HeaderItem';
import ColorChip from '../components/ColorChip';
import { setTimeout } from 'timers';

export default {
	name: 'Game',
	components: {
		HeaderItem,
		ColorChip,
	},
	data() {
		return {
			isDev: false,
		};
	},
	computed: {
		...mapState([
			'lives',
			'score',
			'level',
			'tutorialIsLaunched',
			'swatches',
			'dropzones',
			'activeColor',
		]),
		...mapGetters([
			'getDropzoneByIndex',
			'getSwatchByIndex',
			'getSwatchesCount',
			'getSwatchesEnabled',
			'getSwatchesEnabledCount',
			'getRandomSwatchIndexEnabled',
		]),
		numItems() {
			return constants.levels[this.level];
		},
	},
	mounted() {
		this.playLevel();
		EventBus.$on('dropSuccessful', (data) => {
			this.dropSuccessful(data);
		});
	},
	beforeDestroy() {
		EventBus.$off('dropSuccessful');
	},
	methods: {
		...mapMutations([
			'setTutorialIsLaunched',
			'incrementLive',
			'decreaseLive',
			'incrementLevel',
			'incrementScore',
			'incrementBonus',
			'decreaseBonus',
			'setSwatches',
			'setDropzones',
			'setActiveColor',
			'setDropzoneCMYKByIndex',
			'setSwatchDisabledByIndex',
			'resetGame',
		]),
		playLevel() {
			this.initSwatches();
			this.initDropzones();
			if (!this.activeColor) {
				this.setActive();
			}
			drag.init();
		},
		dropSuccessful(dropZoneCurrent) {
			if (dropZoneCurrent) {
				this.doStep(dropZoneCurrent);
			}
		},
		doStep(dropzone) {
			const index = Number(dropzone.dataset.index);
			const colorMixed = color.addColors(
				this.getDropzoneByIndex(index).cmyk, this.activeColor.cmyk);
			
			const swatchCompared = this.getSwatchByIndex(index).cmyk;
			this.setDropzoneCMYKByIndex({ index, cmyk: colorMixed });
			if (color.areEqualColors(colorMixed, swatchCompared)) {
				this.setSwatchDisabledByIndex({ index, isEnabled: false});
				
				if (this.getSwatchesEnabledCount > 0) {
					dropzone.classList.add('disabled');
					this.setActive();
				} else {
					this.handLevelFinished();
				}
			} else {
				this.handFailedMix();
			}
		},
		handFailedMix() {
			console.log("TCL: handFailedMix -> handFailedMix");
			this.$router.push({ name: 'control', params: { isSuccess: false }});
			this.resetGame();
		},
		handLevelFinished() {
			console.log("TCL: handLevelFinished -> handLevelFinished");
			this.$router.push({ name: 'control', params: { isSuccess: true } });
			this.incrementLevel();
			this.incrementLive();
			this.resetGame();
		},
		initSwatches() {
			if (this.swatches.length === 0) {
				let swatches = [];
				for (let i = 0; i < this.numItems; i++) {
					swatches.push({
						index: i,
						cmyk: color.getColorCMYKRandom(),
						isEnabled: true,
					});
				}
				this.setSwatches({ swatches });
			}
		},
		initDropzones() {
			if (this.dropzones.length === 0) {
				let dropzones = [];
				for (let i = 0; i < this.numItems; i++) {
					let swatch = this.getSwatchByIndex(i);
					dropzones.push({
						index: i,
						cmyk: color.getColorRelated(swatch.cmyk),
					});
				}
				this.setDropzones({ dropzones });
			}
		},
		setActive() {
			const indexRandom = this.getRandomSwatchIndexEnabled;
			const activeColor = {
				index: indexRandom,
				cmyk: color.subtractColors(
						this.getSwatchByIndex(indexRandom).cmyk,
						this.getDropzoneByIndex(indexRandom).cmyk,
					),
			}
			this.setActiveColor({ activeColor: activeColor });
		},
	},
};
</script>