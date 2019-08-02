<template>
	<div class="quote">
		<p>{{ quote.quote }}</p>
		<span>{{ quote.author }}</span>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import config from '../config';
const quotes = require('../scripts/quotes.json');

let quotesArray = [];
for (let i in quotes) {
	quotesArray.push([i, quotes[i]]);
}

// Shuffle array
const shuffled = quotesArray.sort(() => 0.5 - Math.random());
let quotesSelected;

// Get sub-array of first n elements after shuffled
quotesSelected = shuffled.slice(0, config.levels.length);

export default {
	name: 'QuoteItem',
	computed: {
		... mapState([
			'level',
		]),
		quote() {
			return quotesSelected[this.level][1];
		},
	},
};
</script>
