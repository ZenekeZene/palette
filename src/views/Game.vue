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
			<div class="bonus">
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
		]),
		playLevel() {
			this.initSwatches();
			this.initDropzones();
			this.setActive();
			drag.init();
		},
		dropSuccessful(dropZoneCurrent) {
			console.log('dropzoneCurrent', dropZoneCurrent);
			if (dropZoneCurrent) {
				this.doStep(dropZoneCurrent);
			}
		},
		doStep(dropzone) {
			console.log('---------- Do Step ----------');
			const index = Number(dropzone.dataset.index);
			console.log('dropzone.cmyk', this.getDropzoneByIndex(index).cmyk);
			console.log('activeColor.cmyk', this.activeColor.cmyk);
			const colorMixed = color.addColors(
				this.getDropzoneByIndex(index).cmyk, this.activeColor.cmyk);
			
			const swatchCompared = this.getSwatchByIndex(index).cmyk;
			this.setDropzoneCMYKByIndex({ index, cmyk: colorMixed });
			if (color.areEqualColors(colorMixed, swatchCompared)) {
				this.setSwatchDisabledByIndex({ index, isEnabled: false});
				
				console.log(this.swatches.filter(swatch => swatch.isEnabled).length);
				if (this.swatches.filter(swatch => swatch.isEnabled).length > 0) {
					//dropzone.classList.add('disabled');
					this.setActive();
				} else {
					console.log('Hemos acabado.', this.getSwatchesEnabledCount);
					this.handLevelFinished();
					EventBus.$emit('disableDrag');
				}
			} else {
				//this.handFailedMix();
			}
		},
		handFailedMix() {
			this.$router.push({ name: 'control', params: { isSuccess: false }});
		},
		handLevelFinished() {
			console.log('handLevelFinished');
			setTimeout(() => {
				this.$router.push({ name: 'control', params: { isSuccess: true } });
				this.incrementLevel();
				this.incrementLive();
			}, 2000);
		},
		initSwatches() {
			let swatches = [];
			for (let i = 0; i < this.numItems; i++) {
				swatches.push({
					index: i,
					cmyk: color.getColorCMYKRandom(),
					isEnabled: true,
				});
			}
			this.setSwatches({ swatches });
		},
		initDropzones() {
			let dropzones = [];
			for (let i = 0; i < this.numItems; i++) {
				let swatch = this.getSwatchByIndex(i);
				dropzones.push({
					index: i,
					cmyk: color.getColorRelated(swatch.cmyk),
				});
			}
			this.setDropzones({ dropzones });
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