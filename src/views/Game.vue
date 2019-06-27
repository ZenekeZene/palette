<template>
	<section id="app" class="game animated hidden">
		<header class="header">
			<p id="backButton" class="header__back"></p>
			<p class="header__level">LEVEL&nbsp;
				<span id="level"></span>
			</p>
			<p id="score" class="header__score">1240</p>
			<p class="header__lives">
				<span id="lives" class="animated"></span>
			</p>
		</header>
		<main>
			<section id="swatchesGrid" class="swatches"></section>
			<section id="mixesGrid" class="swatches mixer"></section>
		</main>
		<div id="limitActive" class="limit-drag">
			<div id="activeBase" class="active__base"></div>
			<div id="bonusWrapper" class="bonus hidden">
				<button id="bonusButton" class="bonus__button"></button>
				<button id="bonusText" class="bonus__quantity">x1</button>
			</div>
		</div>
	</section>
</template>

<script>
const _ = require('lodash');
import { constants, mutations, config } from '../scripts/common';
import drag from '../scripts/core/drag';
import grid from '../scripts/core/grid';
import color from '../scripts/core/color';
import persist from '../scripts/tools/persist';
import spy from '../scripts/tools/spy';
import bonus from '../scripts/extras/bonus';
import sound from '../scripts/extras/sound';
import record from '../scripts/extras/record';

export default {
	name: 'Game',
	mounted() {

	},
	data() {
		return {
			numItems: 0,
			contSuccess: 0,
			activeColor: null,
			baseActive: null,
			swatches,
			dropzones,
			swatchNodes,
			dropzoneNodes,
			tutorialIsLaunched: false,
		};
	}
};
</script>