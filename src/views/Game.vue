<template>
<transition name="fade">
	<section id="app" class="game animated">
		<header-item></header-item>
		<main>
			<section ref="swatchesGrid" class="swatches"></section>
			<section id="mixesGrid" ref="mixesGrid" class="swatches mixer"></section>
		</main>
		<div ref="limitActive" class="limit-drag">
			<div ref="activeBase" class="active__base"></div>
			<div id="bonusWrapper" class="bonus hidden">
				<button id="bonusButton" class="bonus__button"></button>
				<button id="bonusText" class="bonus__quantity">x1</button>
			</div>
		</div>
	</section>
</transition>
</template>

<script>
const _ = require('lodash');
import HeaderItem from './HeaderItem';
import { constants, mutations, config } from '../scripts/common';
import { serverBus } from '../scripts/core/bus';
import drag from '../scripts/core/drag';
import color from '../scripts/core/color';
import persist from '../scripts/tools/persist';
import spy from '../scripts/tools/spy';
import bonus from '../scripts/extras/bonus';
import sound from '../scripts/extras/sound';
import record from '../scripts/extras/record';

export default {
	name: 'Game',
	data() {
		return {
			numItems: constants.levels[mutations.getLevel()],
			contSuccess: 0,
			activeColor: null,
			swatches: [],
			dropzones: [],
			swatchNodes: [],
			dropzoneNodes: [],
			tutorialIsLaunched: false,
			level: mutations.getLevel(),
			lives: mutations.getLives(),
			score: mutations.getScore(),
		};
	},
	components: {
		HeaderItem,
	},
	mounted() {
		this.playLevel();
		serverBus.$on('activeIsMoved', () => { this.activeIsMoved()});
		serverBus.$on('dropSuccessful', (data) => { this.dropSuccessful(data)});
		serverBus.$on('playLevel', () => { this.playLevel();});
	},
	computed: {
		limitActive() {
			return this.$refs.limitActive;
		},
		activeBase() {
			return this.$refs.activeBase;
		},
		swatchesGrid() {
			return this.$refs.swatchesGrid;
		},
		mixesGrid() {
			return this.$refs.mixesGrid;
		},
	},
	methods: {
		playLevel() {
			this.swatchNodes = this.fillGrid(this.swatchesGrid);
			this.dropzoneNodes = this.fillGrid(this.mixesGrid);

			// Init Swatches, Dropzones and Active
			this.swatches = this.initSwatches(this.swatchNodes);
			this.dropzones = this.initDropzones(this.dropzoneNodes);
			this.activeColor = this.createActive();
			this.tutorialIsNotLaunched = persist.getData('tutorialIsNotLaunched') !== 'false';
			if (this.tutorialIsNotLaunched === true) {
				this.activeBase.classList.add('tutorial');
			}
			drag.init(this.activeColor.el, this.dropzones);
			this.limitActive.append(this.activeColor.el);
			
			if (config._isDev) {
				document.getElementById('app').classList.add('--is-dev');
				spy._giveMeTheSolution(numItems, this.swatches, this.dropzones, this.activeColor);
			} else {
				document.getElementById('app').classList.remove('--is-dev');
			}
		},
		fillGrid(wrapperGrid) {
			let items = [];
			for (let i = 0; i < this.numItems; i++) {
				const itemNode = document.createElement('div');
				items.push(itemNode);
				itemNode.classList.add('swatch', `swatches__swatch${i + 1}`);
				wrapperGrid.append(itemNode);
			}
			return items;
		},
		isSuccessfulMix(indexToCheck) {
			if (_.isEqual(this.swatches[indexToCheck].cmyk, this.dropzones[indexToCheck].cmyk)) {
				this.swatches[indexToCheck].el.classList.add('match-swatch');
				this.dropzones[indexToCheck].el.classList.add('match-mixer');
				this.swatches[indexToCheck].isEnabled = false;
				this.dropzones[indexToCheck].isEnabled = false;
				return true;
			}
			return false;
		},
		updateActive(newActiveColor) {
			this.limitActive.removeChild(this.activeColor.el);
			this.activeColor = newActiveColor;
			this.limitActive.append(this.activeColor.el);
			drag.setActiveNode(this.activeColor.el);
		},
		doStep(dropzone, index, isFromBonus) {
			const colorMixed = this.mix(dropzone.cmyk, this.activeColor.cmyk);
            console.log("TCL: doStep -> this.activeColor.cmyk", this.activeColor.cmyk)
            console.log("TCL: doStep -> dropzone.cmyk", dropzone.cmyk)
			dropzone.setCMYK(colorMixed);

			if (this.isSuccessfulMix(index)) {
				this.contSuccess++;
				if (!isFromBonus) {
					serverBus.$emit('increaseScore');
					serverBus.$emit('stepSuccess', index);
				}
				if (this.contSuccess !== this.swatches.length) {
					this.handSuccessfulMix(dropzone, isFromBonus);
				} else {
					this.handGameFinished();
				}
			} else {
				this.handFailedMix();
			}
		},
		mix(color1, color2) {
			return color.addColors(color1, color2);
		},
		launchTutorial() {
			for (let i = 0; i < this.dropzones.length; i++) {
				this.dropzones[i].el.classList.remove('tutorial');
				this.activeBase.classList.remove('tutorial');
			}
			this.tutorialIsNotLaunched = false;
			persist.saveData('tutorialIsNotLaunched', false);
		},
		handSuccessfulMix(dropzone) {
			dropzone.el.classList.add('disabled');
			this.updateActive(this.createActive());
			if (config._isDev) {
				spy._giveMeTheSolution(this.numItems, this.swatches, this.dropzones, this.activeColor);
			}
		},
		handFailedMix() {
			const { dropzoneWasCorrect, swatchWasCorrect } = this.searchCorrectSwatchAndDropzone();
			this.limitActive.removeChild(this.activeColor.el);
			this.activeColor = null;
			this.contSuccess = 0;
			serverBus.$emit('failedLevel');
			dropzoneWasCorrect.el.classList.add('wasCorrect');
			swatchWasCorrect.el.classList.add('wasCorrect');
			const swatchesNotCorrect = this.swatches.filter(
				(swatch) => !swatch.el.classList.contains('wasCorrect')
			);
			for (let i = 0; i < swatchesNotCorrect.length; i++) {
				swatchesNotCorrect[i].el.classList.add('reset-swatch');
			}
			const dropzonesNotCorrect = this.dropzones.filter(
				(dropzone) => !dropzone.el.classList.contains('wasCorrect')
			);
			for (let i = 0; i < dropzonesNotCorrect.length; i++) {
				dropzonesNotCorrect[i].el.classList.add('reset-swatch');
			}
		},
		handGameFinished() {
			this.limitActive.removeChild(this.activeColor.el);
			this.activeColor = null;
			this.contSuccess = 0;
			serverBus.$emit('successfulLevel');
		},
		searchCorrectSwatchAndDropzone() {
			let dropzoneWasCorrect, swatchWasCorrect;
			for (let i = 0; i < this.swatches.length; i++) {
				for (let j = 0; j < this.dropzones.length; j++) {
					let cmyk = color.addColors(this.activeColor.cmyk, this.dropzones[j].cmyk);
					if (_.isEqual(cmyk, this.swatches[i].cmyk)) {
						dropzoneWasCorrect = this.dropzones[j];
						swatchWasCorrect = this.swatches[i];
					}
				}
			}
			return {
				dropzoneWasCorrect,
				swatchWasCorrect,
			};
		},
		getRandomEnabledItem() {
			const swatchActives = this.swatches.filter(function(swatch) {
				return swatch.isEnabled === true;
			});
			const sample = _.sample(swatchActives);
			if (!sample) {
				console.log('Oh, oh...');
				serverBus.$emit('reset');
			}
			return sample.index;
		},
		createActive() {
			const node = document.createElement('div');
			node.classList.add('active__swatch', 'swatch', 'drag-drop', 'active');

			const indexRandom = this.getRandomEnabledItem();
			const cmyk = color.subtractColors(this.swatches[indexRandom].cmyk, this.dropzones[indexRandom].cmyk);
			this.appendBeatNodeToActiveNode(node, cmyk);

			return new color.ColorObject(
				cmyk,
				node,
			);
		},
		appendBeatNodeToActiveNode(node, cmyk) {
			const beatNode = document.createElement('span');
			beatNode.classList.add('active__beat');
			node.append(beatNode);
			beatNode.style.backgroundColor = color.getRGBColor(color.convertCMYKtoRGB(cmyk));
		},
		activeIsMoved() {
			if (this.dropzones[0].el.classList.contains('tutorial')) return;
			if (this.tutorialIsNotLaunched) {
				this.activeBase.classList.remove('tutorial');
				for (let i = 0; i < this.dropzones.length; i++) {
					this.dropzones[i].el.classList.add('tutorial');
				}
			}
		},
		dropSuccessful(data) {
			const {dropZoneCurrent, index } = data;
			if (this.tutorialIsNotLaunched) {
				this.launchTutorial();
			}
			this.doStep(dropZoneCurrent, index, false);
		},
		dropFailed() {
			if (this.tutorialIsNotLaunched) {
				for (let i = 0; i < this.dropzones.length; i++) {
					this.dropzones[i].el.classList.remove('tutorial');
					this.activeBase.classList.add('tutorial');
				}
			}
		},
		initSwatches(swatchesNodes) {
			let swatches = [];
			for (let i = 0; i < swatchesNodes.length; i++) {
				const swatch = new color.ColorObject(color.getColorCMYKRandom(), swatchesNodes[i]);
				swatch.index = i;
				swatches.push(swatch);
			}
			return swatches;
		},
		initDropzones(dropzoneNodes) {
			const dropzones = [];
			for (let i = 0; i < dropzoneNodes.length; i++) {
				dropzones.push(
					new color.ColorObject(color.getColorRelated(this.swatches[i].cmyk), dropzoneNodes[i])
				);
			}
			return dropzones;
		},
		showCombo(index) {
			this.dropzones[index[0]].el.classList.add('combo');
		},
		bonusUsed() {
			const index = spy._giveMeTheSolution(this.numItems, this.swatches, this.dropzones, this.activeColor);
			this.doStep(this.dropzones[index], index, true);
			statusObserver.notify('stepSuccessBonus');
		}
	}
};
</script>