<template>
	<article class="control">
		<transition name="fade">
			<div v-if="isSuccess" key="success">
				<quote-item></quote-item>
				<button @click="showLevel"><i class="fa fa-play" aria-hidden="true"></i></button>
				<div class="liveUp">+{{ getLivesToWinByLevel }}</div>
			</div>
			<div v-else key="failed">
				<section class="replay">
					<p>You almost got it!
						<span>TRY AGAIN</span>
					</p>
				</section>
				<button @click="showLevel"><i class="fa fa-redo" aria-hidden="true"></i></button>
			</div>
		</transition>
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
