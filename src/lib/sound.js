const Tone = require("tone");
let statusObserver;

function init(statusObserverEntry) {
	statusObserver = statusObserverEntry;
	const synth = new Tone.Synth().toMaster();
	statusObserver.subscribe(function(status, data) {
		if (status === 'stepSuccess') {
			const note = Math.round(Math.random(0, 1)) == 1 ? "C4": "C6"; 
			synth.triggerAttackRelease(note, "8n");
		} else if (status === 'success') {
			synth.triggerAttackRelease("A8", "8n");
		} else if (status === 'fail') {
			synth.triggerAttackRelease("A1", "8n");
		}
	});
}

module.exports = {
	init,
}