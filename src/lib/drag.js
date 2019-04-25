const interact = require('interactjs');

let activeNode, dropzones, callbackWhenDrop;

function offset(el) {
	const rect = el.getBoundingClientRect();
	return { top: rect.top, left: rect.left };
}

function dragMoveListener(event) {
	const target = event.target,
		// keep the dragged position in the data-x/data-y attributes
		x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
	target.classList.add('drag-active');
	// translate the element
	target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

	// update the position attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}

function initDrag() {
	const rect = activeNode.getBoundingClientRect();
	const origin = {
		x: rect.right,
		y: rect.top,
	};
	let isEntered = false;
	let dropZoneCurrent;

	// enable draggables to be dropped into this
	interact('#mixesGrid .swatch:not(.disabled)').dropzone({
		// only accept elements matching this CSS selector
		accept: '.drag-drop',
		// Require a 75% element overlap for a drop to be possible
		overlap: 0.25,

		// listen for drop related events:

		ondropactivate: function(event) {
			// add active dropzone feedback
			event.target.classList.add('drop-active');
			const rect = offset(event.relatedTarget);
			origin.x = rect.left;
			origin.y = rect.top;
		},
		ondragenter: function(event) {
			var draggableElement = event.relatedTarget;
			var dropzoneElement = event.target;

			// feedback the possibility of a drop
			dropzoneElement.classList.add('drop-target');
			draggableElement.classList.add('can-drop');
			isEntered = true;
			for (let i = 0; i < dropzones.length; i++) {
				if (dropzones[i].isMyNode(dropzoneElement)) {
					dropZoneCurrent = dropzones[i];
				}
			}
		},
		ondragleave: function(event) {
			// remove the drop feedback style
			event.target.classList.remove('drop-target');
			event.relatedTarget.classList.remove('can-drop');
			isEntered = false;
			dropZoneCurrent = null;
		},
		ondrop: function(event) {
			event.relatedTarget.textContent = 'Dropped';
		},
		ondropdeactivate: function(event) {
			// remove active dropzone feedback
			event.target.classList.remove('drop-active');
			event.target.classList.remove('drop-target');
		},
	});

	interact('.drag-drop').draggable({
		inertia: true,
		restrict: {
			restriction: 'parent',
			endOnly: false,
			elementRect: { top: 0, left: 0, bottom: 1, right: 0 },
		},
		autoScroll: false,
		// dragMoveListener from the dragging demo above
		onmove: dragMoveListener,
		onend: (event) => {
			const target = event.target;
			target.classList.remove('drag-active');
			const isEnabled =
				!dropZoneCurrent || !dropZoneCurrent.el.classList.contains('disabled');
			if (isEntered && isEnabled) {
				const rect = offset(dropZoneCurrent.el);
				target.style.transform = `translate(0, 0)`;
				target.style.position = 'absolute';
				target.style.left = `${rect.left}px`;
				target.style.top = `${rect.top}px`;
				interact(event.target).unset();
				const index = [].indexOf.call(
					dropZoneCurrent.el.parentNode.children,
					dropZoneCurrent.el
				);
				isEntered = false;
				setTimeout(callbackWhenDrop(dropZoneCurrent, index), 500);
			} else {
				// Out
				target.style.transform = 'translate(0, 0)';
				target.style.webkitTransform = target.style.transform =
					'translate(' + 0 + 'px, ' + 0 + 'px)';

				// update the position attributes
				target.setAttribute('data-x', 0);
				target.setAttribute('data-y', 0);
			}
		},
	});
}

function setActiveNode(activeNodeEntry) {
	activeNode = activeNodeEntry;
}

function init(activeNodeEntry, dropzonesEntry, callbackWhenDropEntry) {
	activeNode = activeNodeEntry;
	dropzones = dropzonesEntry;
	callbackWhenDrop = callbackWhenDropEntry;
	initDrag();
}

const API = {
	init: init,
	setActiveNode: setActiveNode,
};

module.exports = API;
