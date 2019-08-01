import interact from 'interactjs'
import { serverBus } from './bus';

function offset (el) {
	const rect = el.getBoundingClientRect();
	return { top: rect.top, left: rect.left };
}

function dragMoveListener (event) {
	event.target.classList.remove('tutorial');
	const target = event.target;
	// keep the dragged position in the data-x/data-y attributes
	const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
	const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
	target.classList.add('drag-active');
	setPosition(target, x, y);
	//serverBus.$emit('activeIsMoved');
}

function initDrag () {
	const origin = {
		x: 0,
		y: 0,
	}
	let isEntered = false;
	let dropZoneCurrent;

	// enable draggables to be dropped into this
	interact('#dropzonesGrid .swatch:not(.disabled)').dropzone({
		// only accept elements matching this CSS selector
		accept: '.drag-drop',
		// Require a 75% element overlap for a drop to be possible
		overlap: 0.05,
		// listen for drop related events:
		ondropactivate: function(event) {
			// add active dropzone feedback
			event.target.classList.add('drop-active');
			const rect = offset(event.relatedTarget);
			origin.x = rect.left;
			origin.y = rect.top;
		},
		ondragenter: function(event) {
			const draggableElement = event.relatedTarget;
			const dropzoneElement = event.target;

			// feedback the possibility of a drop
			dropzoneElement.classList.add('drop-target');
			draggableElement.classList.add('can-drop');
			isEntered = true;

			dropZoneCurrent = dropzoneElement;
		},
		ondragleave: function(event) {
			// remove the drop feedback style
			event.target.classList.remove('drop-target');
			event.relatedTarget.classList.remove('can-drop');
			isEntered = false;
			dropZoneCurrent = null;
		},
		ondropdeactivate: function(event) {
			// remove active dropzone feedback
			event.target.classList.remove('drop-active');
			event.target.classList.remove('drop-target');
		},
	});

	interact('.drag-drop').unset();
	interact('.drag-drop').draggable({
		inertia: false,
		restrict: {
			restriction: 'parent',
			endOnly: false,
			elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
		},
		autoScroll: false,
		// dragMoveListener from the dragging demo above
		onmove: dragMoveListener,
		onend: (event) => {
			const dropZoneCurrent = event.relatedTarget;
			console.log("TCL: initDrag -> dropZoneCurrent", dropZoneCurrent)
			const target = event.target;
			target.classList.remove('drag-active');
			const isEnabled = dropZoneCurrent && !dropZoneCurrent.classList.contains('disabled');

			if (isEnabled) {
				setPosition(target, 0, 0);
				serverBus.$emit('dropSuccessful', dropZoneCurrent);
			} else {
				setPosition(target, 0, 0);
				serverBus.$emit('dropFailed');
			}
		}
	});
}

function setPosition(target, x, y) {
	// translate the element
	target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;
	// update the position attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}

function init () {
	initDrag();
}

export default {
	init,
}
