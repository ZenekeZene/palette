<template>
	<aside id="control" class="control hidden">
		<div id="quote" class="quote hidden">
			<p id="quotePhrase">Creativity takes courage</p>
			<span id="quoteAuthor">Henry Matisse</span>
		</div>
		<div id="replayText" class="replay hidden">
			<p>You almost got it!
				<span>TRY AGAIN</span>
			</p>
		</div>
		<button id="nextButton" class="animated">
			<i class="fa fa-play" aria-hidden="true"></i>
		</button>
		<button id="replayButton" class="animated">
			<i class="fa fa-redo" aria-hidden="true"></i>
		</button>
		<div id="liveIcon" class="liveUp">+1</div>
		<div id="progression" class="progression level-1">
			<p class="progression__text">Game progression:
				<span>&ensp;&ensp;&ensp;</span>
			</p>
			<div class="progression__graphic">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	</aside>
</template>
<script>
	import { serverBus } from '../scripts/core/bus';
	import quote from '../scripts/extras/quote/quote';
	import credits from '../scripts/pages/credits';
	import final from '../scripts/pages/final';
	import reset from '../scripts/pages/reset';

	export default {
		name: 'control',
		computed: {
			app() {
				return this.$refs.app;
			},
			control() {
				return this.$refs.control;
			},
			nextButton() {
				return this.$refs.nextButton;
			},
			replayButton() {
				return this.$refs.replayButton;
			},
			liveIcon() {
				return this.$refs.liveIcon;
			},
			screenTutorial() {
				return this.$refs.screenTutorial;
			},
			replayText() {
				return this.$refs.replayText;
			},
			backButton() {
				return this.$refs.backButton;
			},
			progression() {
				return this.$refs.progression;
			},
		},
		mounted() {
			serverBus.$on('successfulLevel', ()=> { successfulLevel(); });
			serverBus.$on('failedLevel', ()=> { failedLevel(); });
			serverBus.$on('increaseScore', ()=> { increaseScore(); });

			this.handEvents();
			
			quote.init();	
			credits.init();
			final.init();
			reset.init();
			
			serverBus.$emit('showHome');
		},
		methods: {
			showFinalPage(isGameCompleted) {
				serverBus.$emit('showFinalPage', isGameCompleted);
				serverBus.$emit('handRecord');
			},
			successfulLevel() {
				let levelCurrent = mutations.getLevel();
				if (mutations.areLevelsFinished()) {
					this.showFinalPage(true);
				} else {
					actions.increaseLife();
					levelCurrent = actions.increaseLevel();
					progression.classList.add('progression', `level-${ levelCurrent + 1 }`);

					this.control.classList.add('fadeIn');
					this.control.classList.remove('hidden');
					this.app.classList.remove('fadeIn');
					this.app.classList.add('fadeOut');
					this.nextButton.classList.remove('hidden');
					this.nextButton.classList.add('fadeIn');
					this.replayButton.classList.add('hidden');
					this.replayText.classList.add('hidden');
				}
			},
			failedLevel() {
				progression.classList.add('progression', `level-${mutations.getLevel()}`);
				let lives = mutations.getLives();
				if (lives > 1) {
					actions.decreaseLife();

					liveIcon.classList.add('hidden');
					this.control.classList.add('fadeIn');
					this.control.classList.remove('hidden');
					this.app.classList.add('fadeOut');
					this.nextButton.classList.add('hidden');
					this.replayText.classList.remove('hidden');
					this.replayText.classList.add('fadeIn');
					this.replayButton.classList.remove('hidden');
					this.replayButton.classList.add('fadeIn');
				} else {
					this.showFinalPage(false);
				}
			},
			handEvents() {
				backButton.addEventListener('click', function() {
					serverBus.$emit('showHome');		
					serverBus.$emit('cleanLevel');
					serverBus.$emit('backButton');
					this.app.classList.add('fadeOut', 'animated');
					this.app.classList.remove('fadeIn');
				});

				screenTutorial.addEventListener('click', function() {
					screenTutorial.classList.remove('fadeIn');
					screenTutorial.classList.add('fadeOut');
					this.app.classList.add('fadeIn');
					this.app.classList.remove('fadeOut', 'hidden');
				});

				this.nextButton.addEventListener('click', showLevel);
				this.replayButton.addEventListener('click', showLevel);
			},
			showLevel() {
				serverBus.$emit('playLevel');
				this.control.classList.add('hidden');
				this.app.classList.remove('fadeOut');
				this.app.classList.add('fadeIn');
			}
		}
	}
</script>
