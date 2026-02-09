<script lang="ts">
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import { isNil } from 'lodash-es';
	import { onDestroy } from 'svelte';
	import { ExtendedTranslationType, getExtendedTranslations, OFFERED_SERVICES } from './model';

	let selectedIndex: number | null = $state(null);
	let isBodyScrollLocked = false;
	let previousBodyOverflow = '';
	let previousBodyPaddingRight = '';

	function openPopup(index: number) {
		selectedIndex = index;
	}

	function closePopup() {
		selectedIndex = null;
	}

	function lockBodyScroll() {
		if (isBodyScrollLocked || typeof document === 'undefined') return;
		const body = document.body;
		previousBodyOverflow = body.style.overflow;
		previousBodyPaddingRight = body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) {
			body.style.paddingRight = `${scrollbarWidth}px`;
		}
		isBodyScrollLocked = true;
	}

	function unlockBodyScroll() {
		if (!isBodyScrollLocked || typeof document === 'undefined') return;
		const body = document.body;
		body.style.overflow = previousBodyOverflow;
		body.style.paddingRight = previousBodyPaddingRight;
		isBodyScrollLocked = false;
	}

	$effect(() => {
		if (isNil(selectedIndex)) {
			unlockBodyScroll();
			return;
		}
		lockBodyScroll();
		return () => {
			unlockBodyScroll();
		};
	});

	onDestroy(() => {
		unlockBodyScroll();
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') closePopup();
	}}
/>

<section class="bg-white pt-12 text-primary max-2xl:px-4">
	<div class="pb-8 text-center">
		<h1 class="text-3xl font-semibold sm:text-4xl">
			{$translate('user.pages.home.offeredServices.title')}
		</h1>
	</div>

	<div class="grid grid-cols-2 gap-5 max-md:flex max-md:flex-col">
		{#each OFFERED_SERVICES as { prefix, icon }, i (i)}
			<div class="flex flex-1 flex-col gap-7 rounded-lg border border-accent p-10 text-left">
				<span class="flex items-center gap-6">
					<i class={`text-4xl text-accent ${icon}`}></i>
					<h3 class="font-bold">{$translate(`${prefix}.title`)}</h3>
				</span>
				<p>{$translate(`${prefix}.description`)}</p>
				<span class="flex-auto"></span>
				<Button tailwind="w-full bg-white border border-accent" onclick={() => openPopup(i)}>
					{$translate('user.pages.home.offeredServices.learnMore')}
				</Button>
			</div>
		{/each}
	</div>
</section>

{#if !isNil(selectedIndex)}
	{@const selectedOffer = OFFERED_SERVICES[selectedIndex]}
	{@const extendedTranslations = getExtendedTranslations(selectedIndex)}

	<div
		tabindex="0"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		role="dialog"
		aria-modal="true"
		aria-label="Learn more popup"
		onclick={closePopup}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				closePopup();
			}
		}}
	>
		<div
			class="relative flex max-h-[80dvh] max-w-[min(80dvw,40rem)] flex-col rounded-2xl border-2 border-primary bg-white p-4 pt-12"
		>
			<button
				onclick={closePopup}
				aria-label="close"
				class="absolute top-4 right-4 cursor-pointer rounded-full bg-white p-1 hover:shadow-lg"
			>
				<i class="fa-solid fa-xmark"></i>
			</button>

			<div
				class="min-h-0 flex-1 overflow-auto"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.preventDefault()}
				role="none"
			>
				<span>
					<i class={`text-2xl text-accent ${selectedOffer.icon}`}></i>
					<span class="my-6 ml-4 text-2xl font-bold"
						>{$translate(`${selectedOffer.prefix}.title`)}</span
					>
				</span>

				{#each extendedTranslations as { type, value }, i (i)}
					{#if type === ExtendedTranslationType.title}
						<div class="mt-6 mb-2 text-lg font-bold">{@html $translate(value)}</div>
					{:else if type === ExtendedTranslationType.paragraph}
						<div class="my-2">{@html $translate(value)}</div>
					{:else if type === ExtendedTranslationType.listItem}
						<div class="ml-2">
							• {@html $translate(value)}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}
