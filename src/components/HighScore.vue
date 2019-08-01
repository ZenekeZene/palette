<template>
	<section id="homeHighScore" class="home-hiscore invisible">
		<div class="hiscore__title">HI SCORE</div>
		<div class="hiscore__body">
			<p class="header__level">LEVEL <span id="highLevel">0</span></p>
			<p id="highScore" class="header__score">0</p>
			<p id="shareLink" class="header__share">SHARE</p>
		</div>
	</section>
</template>

<script>
export default {
	name: 'HighScore',
};
</script>

