//const Tone = require("tone");
import { Howl } from 'howler';
const musicBackground = ;
let statusObserver;
let mute;

function init(statusObserverEntry, muteEntry) {
	statusObserver = statusObserverEntry;
	mute = muteEntry;
	let ambient = new Howl({
		src: [require("../sounds/music-bg.mp3")],
		autoplay: false,
		loop: true,
		volume: 0.5,
		html5: true,
		mobileAutoEnable: true,
	});

	const fail = new Howl({
		src: [require("../sounds/effect-fail.mp3")],
		autoplay: false,
		loop: false,
		volume: 0.5,
		html5: true,
		mobileAutoEnable: true,
	});

	const success = new Howl({
		src: [require("../sounds/effect-success.mp3")],
		autoplay: false,
		loop: false,
		volume: 0.1,
		html5: true,
		mobileAutoEnable: true,
	});

	let ambientSound;
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
}

export default {
	init,
}