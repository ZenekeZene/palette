<template>
	<aside class="final">
		<header class="header">
			<p @click="back()" class="header__back"></p>
		</header>
		<div class="final-message game-end" v-if="isCompleted">
			<h2>Congratulations!</h2>
			<h3>You have overcome all the levels of Palette with
				<span class="js-contSuccessfulFinalPage">points</span>
			</h3>
			<a class="js-share-link header__share">SHARE YOUR RECORD</a>
		</div>
		<div class="final-message" v-else>
			<h2>Well done!</h2>
			<h3>You have finished Palette with
				<span id="score">points at level</span>
			</h3>
			<p><span id="level">LEVEL</span></p>
			<a class="js-share-link header__share">SHARE YOUR RECORD</a>
		</div>
		<div class="confetti">
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
			<div class="confetti-piece"></div>
		</div>
	</aside>
</template>
<script>
export default {
	name: 'Final',
	data() {
		return {
			isCompleted: false,
		};
	},
	methods: {
		back() {
			this.$router.push({ name: 'home' });
		},
		shareUrl() {
			openUrl(shareUrlFinal);
		},
		setFinalMessage() {
			let textTweet = '';
			const levelCurrent = mutations.getLevel();
			const score = mutations.getScore();
			
			if (!this.isGameCompleted) {
				textTweet = `I+have+finished+@PlayPalette+with+${score}+points+at+level+${levelCurrent + 1}!!!`;
			} else {
				textTweet = `I+have+overcome+all+the+levels+of+@PlayPalette+with+${score}+points!!!`;
			}
			this.shareUrlFinal = `${config.tweet.pref}${textTweet}${config.tweet.suf}`;
		}
	},
};
</script>

