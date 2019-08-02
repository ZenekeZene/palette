<template>
	<section id="app" class="game animated" :class="{ '--is-dev': isDev }">
		<header-item></header-item>
		<main>
			<section ref="swatchesGrid" class="swatches">
				<color-chip v-for="(swatch, index) in swatches" :key="index"
					:index=swatch.index
					:cmyk="swatch.cmyk"></color-chip>
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
import { serverBus } from '../scripts/core/bus';
import drag from '../scripts/core/drag';
import color from '../scripts/core/color';
import bonus from '../scripts/extras/bonus';
import HeaderItem from '../components/HeaderItem';
import ColorChip from '../components/ColorChip';

export default {
	name: 'Game',
	components: {
		HeaderItem,
		ColorChip,
	},
	data() {
		return {
			contSuccess: 0,
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
	created() {
		this.playLevel();
		serverBus.$on('playLevel', () => { this.playLevel(); });
		serverBus.$on('activeIsMoved', () => { this.activeIsMoved()});
		serverBus.$on('dropSuccessful', (data) => { this.dropSuccessful(data)});
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
		doStep(dropzone, isFromBonus) {
			const index = Number(dropzone.dataset.index);
			const colorMixed = color.addColors(
				this.getDropzoneByIndex(index).cmyk, this.$store.state.activeColor.cmyk);
			
			const swatchCompared = this.getSwatchByIndex(index).cmyk;
			this.setDropzoneCMYKByIndex({ index, cmyk: colorMixed });
			if (color.areEqualColors(colorMixed, swatchCompared)) {
				this.setSwatchDisabledByIndex({ index, isEnabled: false});
				
				this.contSuccess += 1;
				if (this.contSuccess !== this.getSwatchesCount) {
					//dropzone.classList.add('disabled');
					this.setActive();
				} else {
					this.handLevelFinished();
				}
			} else {
				//this.handFailedMix();
			}
		},
		handFailedMix() {
			this.$router.push({ name: 'control', params: { isSuccess: false }});
		},
		handLevelFinished() {
			this.$router.push({ name: 'control', params: { isSuccess: true } });
			this.incrementLevel();
			this.incrementLive();
		},
		dropSuccessful(dropZoneCurrent) {
			this.doStep(dropZoneCurrent, false);
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