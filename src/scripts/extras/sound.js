//const Tone = require("tone");
import { Howl, Howler } from 'howler';
import persist from '../tools/persist';
let statusObserver, mute;
const musicAsset = require("../../sounds/music-bg.mp3")
let ambient, fail, success, ambientSound;
let isPlaying = false;
const soundButton = document.getElementById('soundButton');

function init(statusObserverEntry) {
	statusObserver = statusObserverEntry;
	mute = persist.getData('mute') || false;
	mute = (mute == 'true');

	if (mute) {
		soundButton.classList.add('--silence');
	} else {
		soundButton.classList.remove('--silence');
	}

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
		src: [require("../../sounds/effect-fail.mp3")],
		autoplay: false,
		loop: false,
		volume: 0.5,
		html5: true,
		mobileAutoEnable: true,
	});

	success = new Howl({
		src: [require("../../sounds/effect-success.mp3")],
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

	soundButton.addEventListener('click', function() {
		mute = !mute;
		persist.saveData('mute', mute);
		if (mute) {
			soundButton.classList.add('--silence');
		} else {
			soundButton.classList.remove('--silence');
		}
		statusObserver.notify('mute', mute);
	})

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