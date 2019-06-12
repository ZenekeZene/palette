//const Tone = require("tone");
import { Howl, Howler } from 'howler';
let statusObserver;
let mute;
const musicAsset = require("../sounds/music-bg.mp3")
let ambient, fail, success, ambientSound;
let isPlaying = false;

function init(statusObserverEntry, muteEntry) {
	statusObserver = statusObserverEntry;
	mute = muteEntry;
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
		volume: 0.5,
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

	statusObserver.subscribe(function(status, data) {
		if (mute === false) {
			if (status === 'playLevel') {
				if (!ambient.playing(ambientSound)) {
					ambientSound = ambient.play();
				}
				isPlaying = true;
				ambient.fade(ambient.volume(ambientSound), 1, 1250);
			} else if (status === 'success' || status === 'stepSuccess' || status === 'stepSuccessBonus') {
				success.play();
				isPlaying = false;
			} else if (status === 'fail') {
				ambient.fade(1, 0, 250, ambientSound);
				fail.play();
				isPlaying = false;
			} else if (status === 'backButton') {
				ambient.fade(1, 0, 1250);
				isPlaying = false;
			}
		}
		if (status === 'mute') {
			mute = data[0];
		}
	});

	window.addEventListener("focus", function(event) {
		if (isPlaying) {
			ambient.fade(0, 1, 250);
		}
	}, false);

	window.addEventListener("blur", function(event) {
		if (isPlaying) {
			ambient.fade(1, 0, 250);
		}
	}, false);
}

export default {
	init,
}