<template>
	<main>
		<transition name="fade" appear>
			<router-view />
		</transition>
	</main>
</template>

<script>
export default {
	name: 'App',
}
</script>
