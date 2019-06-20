<template>
<aside id="homePage" class="home fadeIn animated">
	<header class="home-header">
		<div class="home-header__logo fadeInDown animated">
			<img src="img/logo.svg" alt="Palette logo" height="50">
		</div>
		<div class="header">
			<p class="header__level">LEVEL&nbsp;
				<span id="level"></span>
			</p>
			<p id="score" class="header__score">40</p>
			<p id="lives" class="header__lives">17</p>
		</div>
	</header>
	<nav class="home-buttons">
		<button id="playButton" class="home-buttons__play"></button>
		<button id="rateButton" class="home-buttons__rate"></button>
		<button id="soundButton" class="home-buttons__sound"></button>
		<button id="resetButton" class="home-buttons__reset"></button>
		<button id="creditsButton" class="home-buttons__about"></button>
		<a id="eulaButton" class="home-buttons__eula" onclick="openUrl('http://palette.ws/legal.html')" href="#"></a>
	</nav>
	<section id="homeHighScore" class="home-hiscore invisible">
		<div class="hiscore__title">HI SCORE</div>
		<div class="hiscore__body">
			<p class="header__level">LEVEL <span id="highLevel">0</span></p>
			<p id="highScore" class="header__score">0</p>
			<p id="shareLink" class="header__share">SHARE</p>
		</div>
	</section>
	<a class="donate-button" onclick="openUrl('https://www.buymeacoffee.com/PilPilGames')" href="#"></a>
</aside>
</template>

<script>
export default {
  name: "HomePage",
};
</script>