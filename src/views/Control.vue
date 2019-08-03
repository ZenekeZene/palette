<template>
	<article class="control">
		<template v-if="isSuccess">
			<quote-item></quote-item>
			<button @click="showLevel"><i class="fa fa-play" aria-hidden="true"></i></button>
			<div class="liveUp">+{{ getLivesToWinByLevel }}</div>
		</template>
		<template v-else>
			<section class="replay">
				<p>You almost got it!
					<span>TRY AGAIN</span>
				</p>
			</section>
			<button @click="showLevel"><i class="fa fa-redo" aria-hidden="true"></i></button>
		</template>
		<progression-decorator></progression-decorator>
	</article>
</template>
<script>
	import { mapGetters, mapMutations } from 'vuex';
	import QuoteItem from '../components/QuoteItem';
	import ProgressionDecorator from '../components/ProgressionDecorator';

	export default {
		name: 'control',
		components: {
			QuoteItem,
			ProgressionDecorator,
		},
		computed: {
			...mapGetters([
				'getLivesToWinByLevel',
			]),
			isSuccess() {
				return this.$route.params.isSuccess;
			},
		},
		methods: {
			showLevel() {
				this.$router.push({ name: 'game' });
			},
		}
	}
</script>
