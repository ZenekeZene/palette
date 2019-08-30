<template>
	<article class="game" :class="{ '--is-dev': isDev }">
		<header-item></header-item>
		<section ref="swatchesGrid" class="swatches">
			<color-chip v-for="(swatch, index) in swatches" :key="index"
				:index=swatch.index
				:cmyk="swatch.cmyk"
				:class="{
					'--is-correct': giveMeTheIndexOfTheSolution() === index && isDev,
					'match-mixer': swatch.isEnabled === false,
					'was-correct': giveMeTheIndexOfTheSolution() === index && launchFailFeedback,
					'was-not-correct': giveMeTheIndexOfTheSolution() !== index && launchFailFeedback,
				}"
				:ref="`swatch-${index}`"
				:data-index=swatch.index
			></color-chip>
		</section>
		<section ref="dropzonesGrid" class="swatches mixer">
			<color-chip v-for="(dropzone, index) in dropzones" :key="index"
				:index=dropzone.index
				:cmyk="dropzone.cmyk"
				:class="{
					'--is-correct': giveMeTheIndexOfTheSolution() === index && isDev,
					'match-mixer': dropzone.isEnabled === false,
					'tutorial': !tutorialIsLaunched && activeIsMoved,
					'was-correct': giveMeTheIndexOfTheSolution() === index && launchFailFeedback,
					'was-not-correct': giveMeTheIndexOfTheSolution() !== index && launchFailFeedback,
				}"
				:ref="`dropzone-${index}`"
				:data-index=dropzone.index
			></color-chip>
		</section>
		<section ref="limitActive" class="limit-drag">
			<div ref="activeBase" class="active__base"
				:class="{ 'tutorial': !tutorialIsLaunched && !activeIsMoved }"
			></div>
			<color-chip
				v-if="activeColor && !launchFailFeedback"
				class="active__swatch drag-drop active"
				:cmyk=activeColor.cmyk
				:style="{ 'opacity': launchFailFeedback ? 0: 1 }"
			>
				<span class="active__beat" :style="{ backgroundColor: activeColorRender }"></span>
			</color-chip>
			<bonus-item
				v-show="bonus > 0"
				:triggerCheckBonus="triggerCheckBonus"
				:indexOfDropzoneToCheck="lastIndexDropped"
				@bonusGot="bonusGot"
				@bonusUsed="bonusUsed"
			></bonus-item>
		</section>
	</article>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import config from '../config';
import drag from '../scripts/drag';
import color from '../scripts/color';
import { EventBus } from '../scripts/EventBus.js';
import HeaderItem from '../components/HeaderItem';
import ColorChip from '../components/ColorChip';
import BonusItem from '../components/BonusItem';

export default {
	name: 'Game',
	components: {
		HeaderItem,
		ColorChip,
		BonusItem,
	},
	data() {
		return {
			isDev: config._isDev,
			triggerCheckBonus: 0,
			activeIsMoved: false,
			lastIndexDropped: 0,
			launchFailFeedback: false,
		};
	},
	mounted() {
		this.playLevel();
		EventBus.$on('dropSuccessful', (data) => {
			this.dropSuccessful(data);
		});
		EventBus.$on('activeIsMoved', () => {
			this.activeIsMoved = true;
		});
	},
	beforeDestroy() {
		EventBus.$off('dropSuccessful');
	},
	computed: {
		...mapState([
			'lives',
			'level',
			'score',
			'bonus',
			'swatches',
			'dropzones',
			'activeColor',
			'tutorialIsLaunched',
		]),
		...mapGetters([
			'getDropzoneByIndex',
			'getSwatchByIndex',
			'getSwatchesCount',
			'getSwatchesEnabled',
			'getSwatchesEnabledCount',
			'getRandomSwatchIndexEnabled',
			'wasTheLastLevel',
		]),
		numItems() {
			return config.levels[this.level];
		},
		activeColorRender() {
			return color.getRGBColor(color.convertCMYKtoRGB(this.activeColor.cmyk));
		},
	},
	methods: {
		...mapMutations([
			'incrementLive',
			'decreaseLive',
			'incrementLevel',
			'incrementScore',
			'setSwatches',
			'setDropzones',
			'setActiveColor',
			'setDropzoneCMYKByIndex',
			'setSwatchDisabledByIndex',
			'setDropzoneDisabledByIndex',
			'setTutorialIsLaunched',
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
		dropSuccessful(dropzoneCurrent) {
			this.activeIsMoved = false;
			if (dropzoneCurrent) {
				this.doStep(dropzoneCurrent);
			}
		},
		forceStep(indexOfDropzone) {
			const dropzone = this.$refs[`dropzone-${indexOfDropzone}`][0].$el;
			const swatch = this.$refs[`swatch-${indexOfDropzone}`][0].$el;

			if (this.isMixSuccessful(indexOfDropzone)) {
				swatch.classList.add('match-mixer');
				dropzone.classList.add('match-mixer');
			}
		},
		doStep(dropzone) {
			const index = Number(dropzone.dataset.index);
			this.triggerCheckBonus++;

			if (this.isMixSuccessful(index)) {
				if (!this.tutorialIsLaunched) {
					this.setTutorialIsLaunched({ status : true });
				}
				this.lastIndexDropped = index;
				this.incrementScore();
			} else {
				this.handFailedMix();
			}
		},
		isMixSuccessful(indexOfDropzone) {
			const colorMixed = color.addColors(
				this.getDropzoneByIndex(indexOfDropzone).cmyk, this.activeColor.cmyk);

			const swatchCompared = this.getSwatchByIndex(indexOfDropzone).cmyk;
			this.setDropzoneCMYKByIndex({ index: indexOfDropzone, cmyk: colorMixed });

			if (color.areEqualColors(colorMixed, swatchCompared)) {
				this.setSwatchDisabledByIndex({ index: indexOfDropzone, isEnabled: false });
				this.setDropzoneDisabledByIndex({ index: indexOfDropzone, isEnabled: false });

				if (this.getSwatchesEnabledCount > 0) {
					this.setActive();
				} else {
					this.handLevelFinished();
				}
				return true;
			}
			return false;
		},
		handFailedMix() {
			this.launchFailFeedback = true;
			setTimeout(() => {
				if (this.lives > 1) {
					this.decreaseLive();
					this.resetGame();
					this.$router.push({ name: 'control', params: { isSuccess: false }});
				} else {
					this.$router.push({ name: 'final', params: { isCompleted: false }});
				}
			}, 2500);
		},
		handLevelFinished() {
			if (this.wasTheLastLevel) {
				this.$router.push({ name: 'final', params: { isCompleted: true }});
			} else {
				this.$router.push({ name: 'control', params: { isSuccess: true }});
				this.incrementLevel();
				this.incrementLive();
				this.resetGame();
			}
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
						isEnabled: true,
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
		giveMeTheIndexOfTheSolution() {
			for(let i = 0; i < this.numItems; i++) {
				const colorMixed = color.addColors(
					this.getDropzoneByIndex(i).cmyk, this.activeColor.cmyk);
				if (_.isEqual(this.getSwatchByIndex(i).cmyk, colorMixed)) {
					return i;
				}
			}
			return null;
		},
		bonusGot(status) {
			this.$refs[`dropzone-${this.lastIndexDropped}`][0].$el.classList.add('combo');
		},
		bonusUsed() {
			this.forceStep(this.giveMeTheIndexOfTheSolution());
		},
	},
};
</script>