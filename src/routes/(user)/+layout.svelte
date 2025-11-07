<script lang="ts">
	import { translate } from '$i18n';
	import { LanguageSelect } from '$lib';
	import { HEADER_PATHS } from './model';
	import { resolve } from '$app/paths';

	let menuOpen = $state(false);

	let { children } = $props();
</script>

<!-- Desktop: header -->
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

		<div class="hidden md:block">
			<LanguageSelect />
		</div>
	</div>
</header>

<!-- Mobile: hamburger button-->
<button
	class="fixed top-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md text-secondary md:hidden"
	aria-label="Open menu"
	onclick={() => (menuOpen = !menuOpen)}
>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-7 w-7">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6h16M4 12h16M4 18h16"
		/>
	</svg>
</button>

<!-- Mobile: drawer -->
{#if menuOpen}
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
		onclick={() => (menuOpen = false)}
	/>
	<div class="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-primary shadow-xl md:hidden">
		<div class="flex items-center justify-between p-4">
			<a
				class="text-2xl font-bold text-accent"
				href={resolve('/(user)/home')}
				onclick={() => (menuOpen = false)}
			>
				Bezstresowo
			</a>
			<button class="p-2 text-secondary" aria-label="Close menu" onclick={() => (menuOpen = false)}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-6 w-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<nav class="flex flex-col gap-3 px-4 pb-6">
			{#each HEADER_PATHS as { href, label }, i (i)}
				<a
					{href}
					class="rounded-md px-2 py-2 text-lg font-semibold text-secondary hover:underline"
					onclick={() => (menuOpen = false)}
				>
					{$translate(label)}
				</a>
			{/each}

			<div class="mt-2">
				<LanguageSelect />
			</div>
		</nav>
	</div>
{/if}

<main class="content bg-background p-4">
	<div class="mx-auto max-w-7xl">
		{@render children?.()}
	</div>
</main>

<footer class="bg-primary text-accent">
	<div class="mx-auto max-w-7xl px-4 py-6">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
			<div class="w-full text-center md:w-auto md:max-w-54 md:text-left">
				<p class="text-pretty">Centrum Psychoterapii Bezstresowo OLESYA HAIDUK</p>
			</div>

			<div class="w-full text-center md:w-auto md:max-w-60 md:text-left">
				<p class="break-keep">
					<b>NIP:</b> 7282877722
				</p>
				<p class="break-keep">
					<b>REGON:</b> 526600299
				</p>
			</div>

			<div class="w-full text-center md:w-auto md:max-w-60 md:text-left">
				<p class="break-keep">
					<b>Tel.:</b>
					<a class="underline-offset-4 hover:underline" href="tel:+48795819910">+48 795 819 910</a>
				</p>
				<p class="break-keep">
					<b>E-mail:</b>
					<a class="underline-offset-4 hover:underline" href="mailto:beztresowo@gmail.com"
						>beztresowo@gmail.com</a
					>
				</p>
			</div>

			<span class="hidden flex-auto md:block"></span>
		</div>
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

	@media (max-width: 767px) {
		header .mx-auto > :not(:first-child) {
			display: none !important;
		}
	}
</style>
