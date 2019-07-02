<template>
<aside id="homePage" class="home">
	<header class="home-header">
		<div class="home-header__logo">
			<img src="img/logo.svg" alt="Palette logo" height="50">
		</div>
		<div class="header">
			<p class="header__level">LEVEL&nbsp;
				<span>{{ level }}</span>
			</p>
			<p class="header__score">{{ score }}</p>
			<p class="header__lives">{{ lives }}</p>
		</div>
	</header>
	<nav class="home-buttons">
		<router-link to="game" class="home-buttons__play"></router-link>
		<button id="rateButton" class="home-buttons__rate"></button>
		<button id="soundButton" class="home-buttons__sound"></button>
		<button id="resetButton" class="home-buttons__reset"></button>
		<router-link to="credits" class="home-buttons__about"></router-link>
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
import { mutations } from '../scripts/common';
export default {
	name: "HomePage",
	data() {
		return {
			lives: mutations.getLives(),
			score: mutations.getScore(),
			level: mutations.getLevel(),
			highLevel: 0,
		} 
	}
};
</script>