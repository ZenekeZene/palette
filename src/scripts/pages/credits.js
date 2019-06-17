import interact from 'interactjs';
import { constants } from '../common';
const statusObserver = constants.statusObserver;

let creditsEnabled = true;
let creditsInterval;
const credits = document.getElementById('credits');
const creditsPage = document.getElementById('creditsPage');
const homePage = document.getElementById('homePage');
const backButton = document.getElementById('backButtonCredits');

function initDragCredits() {
	creditsInterval = setInterval(function() {
		const rect = credits.getBoundingClientRect();
		if (!insideViewport(rect)) {
			if (rect.bottom <= 0) {
				setPositionCredits(0, window.innerHeight);
			}
		}

		// keep the dragged position in the data-x/data-y attributes
		const x = (parseFloat(credits.getAttribute('data-x')) || 0);
		const y = (parseFloat(credits.getAttribute('data-y')) || 0) - 2;
		setPositionCredits(x, y);
	}, 30);
}


function clearCredits() {
	clearInterval(creditsInterval);
	setPositionCredits(0, 150);
}

function setPositionCredits(x, y) {
	credits.style.webkitTransform = credits.style.transform = `translate(${x}px, ${y}px)`;
	// update the position attributes
	credits.setAttribute('data-x', x);
	credits.setAttribute('data-y', y);
}

function insideViewport(bounding) {
	if (
		bounding.top >= 0 &&
		bounding.left >= 0 &&
		bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
		bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
	) {
		return true;
	} else {
		return false;
	}
}

function handCreditsDrag() {
	interact(credits).draggable({
		inertia: true,
		restriction: '.credits',
		lockAxis: 'y',
		onmove: (event) => {
			event.target.classList.remove('--animation-disabled');
			const target = event.target,
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data-x')) || 0) + Math.round(event.dx),
				y = (parseFloat(target.getAttribute('data-y')) || 0) + Math.round(event.dy);
			target.classList.add('drag-active');
			// translate the element
			target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

			// update the posiion attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		},
	});
}

function handEvents() {
	creditsButton.addEventListener('click', function() {
		if (creditsEnabled) {
			homePage.classList.add('fadeOut');
			homePage.classList.remove('fadeIn');
			creditsPage.classList.remove('hidden');
			initDragCredits();
			creditsEnabled = false;
		}
	});

	backButton.addEventListener('click', function() {
		statusObserver.notify('showHome');
		creditsEnabled = true;
		creditsPage.classList.add('hidden');
		clearCredits();
	});
}

function init() {
	setPositionCredits(0, 150);
	handCreditsDrag();
	handEvents();
}

export default {
	init,
}