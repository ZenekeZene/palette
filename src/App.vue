<template>
	<main style="height: 100%;">
		<fade-transition :duration="1000">
			<router-view />
		</fade-transition>
	</main>
</template>

<script>
export default {
	name: 'App',
}
</script>
