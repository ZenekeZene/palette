//const Tone = require("tone");
import { Howl, Howler } from 'howler';
import { EventBus } from '../scripts/EventBus.js';

let mute;
const musicAsset = require("../sounds/music-bg.mp3")
let ambient, fail, success, ambientSound;

function init() {
	Howler.autoUnlock = true;
	ambient = new Howl({
		src: [musicAsset],
		autoplay: false,
		loop: true,
		volume: 0.5,
		html5: false,
		mobileAutoEnable: true,
		autoSuspend: false,
	});

	fail = new Howl({
		src: [require("../sounds/effect-fail.mp3")],
		autoplay: false,
		loop: false,
		volume: 0.005,
		html5: true,
		mobileAutoEnable: true,
	});

	success = new Howl({
		src: [require("../sounds/effect-success.mp3")],
		autoplay: false,
		loop: false,
		volume: 0.1,
		html5: true,
		mobileAutoEnable: true,
	});

	EventBus.$on('playMusic', () => {
		ambient.fade(ambient.volume(ambientSound), 1, 1250);
	});

	EventBus.$on('stopMusic', () => {
		ambient.fade(ambient.volume(ambientSound), 0, 1250);
	});

	EventBus.$on('playFailSound', () => {
		// ambient.fade(ambient.volume(ambientSound), 0, 250);
		// fail.play();
	});

	EventBus.$on('playSuccessfulSound', () => {
		console.log('playSuccessfulSound');
		success.play();
	});

	window.addEventListener("blur", function(event) {
		ambient.fade(1, 0, 250);
	}, false);
}

export default {
	init,
}
