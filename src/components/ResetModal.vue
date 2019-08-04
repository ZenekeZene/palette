<template>
<fade-transition>
	<modal name="reset-modal" class="v-custom-modal">
		<section class="notification">
			<h2 class="notification__title">Reset game</h2>
			<p class="notification__text">Are you sure you want to reset your game? All your progression will be deleted.</p>
			<p class="notification__button">
				<button @click="$modal.hide('reset-modal')" class="notification__button--refuse"></button>
				<button @click="reset" class="notification__button--accept"></button>
			</p>
		</section>
	</modal>
</fade-transition>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	name: 'ResetModal',
	methods: {
		...mapMutations([
			'resetDisplay',
		]),
		reset() {
			this.resetDisplay();
			location.reload();
		},
	},
};
</script>