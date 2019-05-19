const Tone = require("tone");
let statusObserver;
let mute;

function init(statusObserverEntry, muteEntry) {
	statusObserver = statusObserverEntry;
	mute = muteEntry;
	const synth = new Tone.Synth().toMaster();
	statusObserver.subscribe(function(status, data) {
		if (status === 'stepSuccess' && !mute) {
			const note = Math.round(Math.random(0, 1)) == 1 ? "C4": "C6"; 
			synth.triggerAttackRelease(note, "8n");
		} else if (status === 'success' && !mute) {
			synth.triggerAttackRelease("A8", "8n");
		} else if (status === 'fail' && !mute) {
			synth.triggerAttackRelease("A1", "8n");
		} else if (status === 'mute') {
			mute = data[0];
		}
	});
}

module.exports = {
	init,
}