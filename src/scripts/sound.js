//const Tone = require("tone");
import { Howl, Howler } from 'howler';
let statusObserver;
let mute;
const musicAsset = require("../sounds/music-bg.mp3")
let ambient, fail, success, ambientSound;

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
				ambient.fade(ambient.volume(ambientSound), 1, 1250);
			} else if (status === 'success' || status === 'stepSuccess') {
				success.play();
			} else if (status === 'fail') {
				ambient.fade(1, 0, 250, ambientSound);
				fail.play();
			} else if (status === 'backButton') {
				ambient.fade(1, 0, 1250);
			}
		}
		if (status === 'mute') {
			mute = data[0];
		}
	});

	window.addEventListener("focusin", function(event) { 
		if (ambient.playing(ambientSound)) {
			ambient.fade(0, 1, 250, ambientSound);
		}
	}, false);

	window.addEventListener("focusout", function(event) { 
		if (ambient.playing(ambientSound)) {
			ambient.fade(ambient.volume(ambientSound), 0, 1250, ambientSound);
		}
	}, false);
}

export default {
	init,
}