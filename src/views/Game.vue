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
				}"
				:ref="`dropzone-${index}`"
				:data-index=dropzone.index
			></color-chip>
		</section>
		<section ref="limitActive" class="limit-drag">
			<div ref="activeBase" class="active__base"></div>
			<color-chip
				v-if="activeColor"
				:cmyk=activeColor.cmyk
				class="active__swatch drag-drop active"
			></color-chip>
			<bonus-item
				v-show="bonus > 0"
				:triggerCheckBonus="triggerCheckBonus"
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
			isDev: true,
			triggerCheckBonus: 0,
		};
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
	computed: {
		...mapState([
			'lives',
			'level',
			'score',
			'bonus',
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
			'wasTheLastLevel',
		]),
		numItems() {
			return config.levels[this.level];
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
		forceStep(index) {
			const dropzone = this.$refs[`dropzone-${index}`][0].$el;
			const swatch = this.$refs[`swatch-${index}`][0].$el;

			if (this.mixCompared(index)) {
				swatch.classList.add('match-mixer');
				dropzone.classList.add('match-mixer');
			}
		},
		doStep(dropzone) {
			const index = Number(dropzone.dataset.index);
			this.triggerCheckBonus++;

			if (this.mixCompared(index)) {
				this.incrementScore();
			} else {
				this.handFailedMix();
			}
		},
		mixCompared(index) {
			const colorMixed = color.addColors(
				this.getDropzoneByIndex(index).cmyk, this.activeColor.cmyk);

			const swatchCompared = this.getSwatchByIndex(index).cmyk;
			this.setDropzoneCMYKByIndex({ index, cmyk: colorMixed });

			if (color.areEqualColors(colorMixed, swatchCompared)) {
				this.setSwatchDisabledByIndex({ index, isEnabled: false });
				this.setDropzoneDisabledByIndex({ index, isEnabled: false });

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
			if (this.lives > 1) {
				this.decreaseLive();
				this.resetGame();
				this.$router.push({ name: 'control', params: { isSuccess: false }});
			} else {
				this.$router.push({ name: 'final', params: { isCompleted: false }});
			}
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
		bonusUsed() {
			this.forceStep(this.giveMeTheIndexOfTheSolution());
		},
	},
};
</script>