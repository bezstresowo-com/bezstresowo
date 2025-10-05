<script lang="ts">
	import { translate } from '$i18n';
	import { LanguageSelect } from '$lib';
	import { HEADER_PATHS } from './model';
	import { resolve } from '$app/paths';
	import ContactForm from '$lib/ContactForm/ContactForm.svelte';

	let { children } = $props();
</script>

<header class="fixed top-0 left-0 w-full bg-primary p-4">
	<div class="mx-auto flex max-w-7xl items-center gap-4">
		<a class="text-2xl font-bold text-accent" href={resolve('/(user)/home')}>Bezstresowo</a>

		<span class="flex-auto"></span>

		{#each HEADER_PATHS as { href, label }, i (i)}
			<a
				{href}
				class="font-bold text-secondary decoration-secondary decoration-2 underline-offset-4 hover:underline"
				>{$translate(label)}</a
			>
		{/each}

		<LanguageSelect />
	</div>
</header>

<main class="content bg-background p-4">
	<div class="mx-auto max-w-7xl">
		{@render children?.()}
	</div>
</main>

<footer class="bg-primary p-4 text-accent">
	<div class="mx-auto flex max-w-7xl items-center gap-4">
		<div class="max-w-54">
			<p class="text-pretty">Centrum Psychoterapii Bezstresowo OLESYA HAIDUK</p>
		</div>

		<div class="max-w-60 break-keep">
			<p class="break-keep">
				<b> NIP: </b>
				7282877722
			</p>
			<p class="break-keep"><b>REGON:</b> 526600299</p>
		</div>

		<div class="max-w-60">
			<p class="break-keep">
				<b>Tel.:</b> <a href="tel:+48795819910">+48795819910</a>
			</p>
			<p class="break-keep">
				<b>E-mail:</b>
				<a href="mailto:beztresowo@gmail.com">beztresowo@gmail.com</a>
			</p>
		</div>

		<span class="flex-auto"></span>
	</div>
</footer>

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
