<template>
	<modal name="reset-modal" class="v-custom-modal">
		<div class="notification">
			<h2 class="notification__title">Reset game</h2>
			<p class="notification__text">Are you sure you want to reset your game? All your progression will be deleted.</p>
			<p class="notification__button">
				<button @click="$modal.hide('reset-modal')" class="notification__button--refuse"></button>
				<button @click="reset" class="notification__button--accept"></button>
			</p>
		</div>
	</modal>
</template>

<script>

export default {
	name: 'ResetModal',
	methods: {
		reset() {
			location.reload();
		},
		cancel() {
			console.log("TCL: cancel -> cancel");
		},
	},
};
</script>