<script lang="ts">
	import { translate } from '$i18n';
	import { LanguageSelect } from '$lib';
	import { asset } from '$app/paths';
	import { HEADER_PATHS } from './model';
	import { resolve } from '$app/paths';

	let menuOpen = $state(false);
	let selectedPath = $state(HEADER_PATHS[0].href);
</script>

<!-- Desktop: header -->
<header class="fixed top-0 left-0 h-[66px] w-full bg-primary p-4">
	<div class="mx-auto flex max-w-7xl items-center gap-4">
		<a class="text-2xl font-bold text-accent" href={resolve('/(user)/home')}>
			<img src={asset('assets/header-logo.svg')} alt="Bezstresowo Logo" />
		</a>

		<span class="flex-auto"></span>

		{#each HEADER_PATHS as { href, label } (href)}
			<a
				{href}
				class={`${selectedPath === href ? 'text-secondary' : 'text-white'} decoration-secondary decoration-2 underline-offset-4 hover:underline`}
				onclick={() => (selectedPath = href)}>{$translate(label)}</a
			>
		{/each}

		<div class="hidden md:block">
			<LanguageSelect />
		</div>
	</div>
	<!-- Mobile: hamburger button-->
	<button
		class="fixed top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-accent md:hidden"
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
</header>

<!-- Mobile: drawer -->
{#if menuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div
		class="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden"
		onclick={() => (menuOpen = false)}
	/>
	<div class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-primary shadow-xl md:hidden">
		<div class="flex items-center justify-between p-4">
			<a
				class="text-2xl font-bold text-accent"
				href={resolve('/(user)/home')}
				onclick={() => (menuOpen = false)}
			>
				<img src={asset('assets/header-logo.svg')} alt="Bezstresowo Logo" />
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
					class={`${selectedPath === href ? 'text-secondary' : 'text-white'}  px-2 py-2 text-lg text-secondary hover:underline`}
					onclick={() => ((selectedPath = href), (menuOpen = false))}
					>{$translate(label)}
				</a>
			{/each}

			<div class="mt-2">
				<LanguageSelect />
			</div>
		</nav>
	</div>
{/if}

<style lang="css">
	@media (max-width: 767px) {
		header .mx-auto > :not(:first-child) {
			display: none !important;
		}
	}
</style>
