<script lang="ts">
	import { translate } from '$i18n';
	import { LanguageSelect } from '$lib';
	import { asset } from '$app/paths';
	import { HEADER_PATHS } from './model';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	let menuOpen = $state(false);
	let selectedPath = $derived($page.url.pathname);
</script>

<!-- Desktop: header -->
<header class="fixed top-0 left-0 z-1000 w-full bg-primary">
	<div class="mx-auto flex h-16 max-w-7xl items-center gap-4 p-4">
		<a class="text-2xl font-bold text-accent" href={resolve('/(user)/home')}>
			<img src={asset('assets/header-logo.svg')} alt="Bezstresowo Logo" loading="lazy" />
		</a>

		<span class="flex-auto"></span>

		{#each HEADER_PATHS as { href, label } (href)}
			<a
				{href}
				class={`${selectedPath.startsWith(href) ? 'text-secondary' : 'text-white'} decoration-secondary decoration-2 underline-offset-4 hover:underline max-md:hidden`}
				>{$translate(label)}</a
			>
		{/each}

		<div class="max-md:hidden">
			<LanguageSelect />
		</div>

		<!-- Mobile: hamburger button-->
		<button
			class="w-10 cursor-pointer p-2 text-accent md:hidden"
			aria-label="Open menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="aspect-square w-full">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
	</div>
</header>

<!-- Mobile: drawer -->
{#if menuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-1000 bg-black/30 backdrop-blur-sm md:hidden"
		onclick={() => (menuOpen = false)}
	></div>
	<div class="fixed top-0 right-0 z-1000 h-full w-80 max-w-[85vw] bg-primary shadow-xl md:hidden">
		<div class="flex items-center justify-between p-4">
			<a
				class="text-2xl font-bold text-accent"
				href={resolve('/(user)/home')}
				onclick={() => (menuOpen = false)}
			>
				<img src={asset('assets/header-logo.svg')} alt="Bezstresowo Logo" loading="lazy" />
			</a>

			<button
				class="w-10 cursor-pointer p-2 text-secondary"
				aria-label="Close menu"
				onclick={() => (menuOpen = false)}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="aspect-square w-full">
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
					class={`${selectedPath.startsWith(href) ? 'text-secondary' : 'text-white'}  px-2 py-2 text-lg text-secondary hover:underline`}
					onclick={() => {
						menuOpen = false;
					}}
					>{$translate(label)}
				</a>
			{/each}

			<div class="mt-2">
				<LanguageSelect />
			</div>
		</nav>
	</div>
{/if}
