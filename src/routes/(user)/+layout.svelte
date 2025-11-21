<script lang="ts">
	import Footer from '$lib/Footer/Footer.svelte';
	import Header from '$lib/Header/Header.svelte';

	let { children } = $props();
</script>

<Header />

<main class="content bg-white">
	<div class="mx-auto max-w-7xl">
		{@render children?.()}
	</div>
</main>

<Footer />

<style lang="css">
	:root {
		--user-header-height: calc(var(--spacing) * 16);
		--user-footer-height: calc(var(--spacing) * 20);
	}

	.content {
		margin-top: var(--user-header-height);
		min-height: calc(100dvh - var(--user-header-height) - var(--user-footer-height));
	}
</style>
