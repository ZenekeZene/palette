<template>
	<aside id="finalPage" class="final hidden animated">
		<header class="header">
			<p id="backButtonFinal" class="header__back"></p>
		</header>
		<div id="livesOutMessage" class="final-message hidden">
			<h2>Well done!</h2>
			<h3>You have finished Palette with
				<span id="score">points at level</span>
			</h3>
			<p><span id="level">LEVEL</span></p>
			<a class="js-share-link header__share">SHARE YOUR RECORD</a>
		</div>
		<div id="gameEndMessage" class="final-message hidden game-end">
			<h2>Congratulations!</h2>
			<h3>You have overcome all the levels of Palette with
				<span class="js-contSuccessfulFinalPage">points</span>
			</h3>
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
};
</script>

