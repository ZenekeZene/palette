<template>
	<aside id="control" class="control">
		<div id="quote" class="quote">
			<p id="quotePhrase">Creativity takes courage</p>
			<span id="quoteAuthor">Henry Matisse</span>
		</div>
		<div id="replayText" class="replay hidden">
			<p>You almost got it!
				<span>TRY AGAIN</span>
			</p>
		</div>
		<button v-if="isSuccess" @click="showLevel()"><i class="fa fa-play" aria-hidden="true"></i></button>
		<button v-if="!isSuccess" @click="showLevel()"><i class="fa fa-redo" aria-hidden="true"></i></button>
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
			progression() {
				return this.$refs.progression;
			},
		},
		data() {
			return {
				isSuccess: false,	
			};
		},
		mounted() {
			serverBus.$on('successfulLevel', () => { this.successfulLevel(); });
			serverBus.$on('failedLevel', () => { this.failedLevel(); });
			
			quote.init();	
			
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
					this.isSuccess = true;
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
					this.isSuccess = false;
				} else {
					this.showFinalPage(false);
				}
			},
			showLevel() {
				this.$router.push({ name: 'game', });
			},
		}
	}
</script>
