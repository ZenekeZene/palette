<template>
	<aside id="creditsPage" class="credits">
		<header class="header">
			<p class="header__back" @click="back"></p>
		</header>
		<div ref="credits" class="credits-container --animation-disabled">
			<div class="credits-inner">
				<header class="credits-title"></header>
				<div class="credits-title__logo">
					<img src="img/logo.svg" alt="Palette logo" height="50" />
				</div>
				<p class="credits-version">v.1.0.0</p>
				<div class="credits-title__logo">
					<img src="img/pilpil-logo.svg" alt="Pil-Pil logo" height="80" />
				</div>
				<main class="credits-text">
					<h2>Game design and programming</h2>
					<p>Jorge Fuente&nbsp;&nbsp;🎨</p>
					<p>Héctor Villar&nbsp;&nbsp;💾</p>
					<p>Fran Mosteiro&nbsp;&nbsp;📟</p>
					<h2>Special thanks</h2>
					<p>Hawa A.K.A "LemonHead"&nbsp;&nbsp;🍋</p>
					<p>Leire Bartolomé&nbsp;&nbsp;🕹️</p>
					<p>Elena Aguilar&nbsp;&nbsp;🏝️</p>
					<p>Yuka&nbsp;&nbsp;🐶</p>
					<h2>Music and sound effects</h2>
					<p>POND 5&nbsp;&nbsp;🎙</p>
					<a class="link-final" onclick="openUrl('http://palette.ws')" href='#'>palette.ws</a>
				</main>
			</div>
		</div>
	</aside>
</template>

<script>
import interact from 'interactjs';
export default {
	name: 'Credits',
	data() {
		return {
			creditsEnabled: true,
			creditsInterval: null,
			credits: null,
		};
	},
	methods: {
		initDragCredits() {
			this.creditsInterval = setInterval(() => {
				const rect = this.$refs.credits.getBoundingClientRect();
				if (!this.insideViewport(rect)) {
					if (rect.bottom <= 0) {
						this.setPositionCredits(0, window.innerHeight);
					}
				}

				// keep the dragged position in the data-x/data-y attributes
				const x = (parseFloat(this.$refs.credits.getAttribute('data-x')) || 0);
				const y = (parseFloat(this.$refs.credits.getAttribute('data-y')) || 0) - 2;
				this.setPositionCredits(x, y);
			}, 30);
		},
		setPositionCredits(x, y) {
			this.credits.style.webkitTransform = this.credits.style.transform = `translate(${x}px, ${y}px)`;
			// update the position attributes
			this.credits.setAttribute('data-x', x);
			this.credits.setAttribute('data-y', y);
		},
		handCreditsDrag() {
			interact(this.credits).draggable({
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
		},
		clearCredits() {
			clearInterval(this.creditsInterval);
			this.setPositionCredits(0, 150);
		},
		back() {
			this.creditsEnabled = true;
			this.clearCredits();
			this.$router.push({ name: 'home' });
		},
		insideViewport(bounding) {
			return  (
				bounding.top >= 0 &&
				bounding.left >= 0 &&
				bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
				bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
			);
		}
	},
	created() {
	},
	mounted() {
		this.credits = this.$refs.credits;
		this.initDragCredits();
		this.creditsEnabled = false;
		this.setPositionCredits(0, 150);
		this.handCreditsDrag();
	},
};
</script>
