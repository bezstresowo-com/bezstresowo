<script lang="ts">
	import { translate } from '$i18n';
	import { isNil } from 'lodash-es';
	import { CERTIFICATES } from './certificates';
	import { onDestroy } from 'svelte';

	let selectedCertificate: string | null = $state(null);
	let selectedIndex: number | null = $state(null);
	let isBodyScrollLocked = false;
	let previousBodyOverflow = '';
	let previousBodyPaddingRight = '';

	function openCertificate(certificate: string, index: number) {
		selectedCertificate = certificate;
		selectedIndex = index;
	}

	function closeCertificate() {
		selectedCertificate = null;
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
		if (event.key === 'Escape') closeCertificate();
	}}
/>

<section class="bg-white pt-12 text-primary max-2xl:px-4">
	<div class="mx-auto text-center">
		<h1 class="text-3xl font-semibold sm:text-4xl">
			{$translate('user.pages.home.certificates.title')}
		</h1>
	</div>
	<div class="mx-auto mt-6 w-full">
		<div class="grid w-full [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] gap-4">
			{#each CERTIFICATES as cert, i (i)}
				<button
					type="button"
					class="max-w-120 rounded-lg border-2 border-accent bg-primary p-4 transition hover:cursor-pointer hover:border-secondary hover:shadow-md"
					onclick={() => openCertificate(cert, i)}
				>
					<img
						class="aspect-video object-contain"
						src={cert}
						alt={`certificate ${i + 1}`}
						loading="lazy"
					/>
				</button>
			{/each}
		</div>
	</div>
</section>

{#if selectedCertificate}
	<div
		tabindex="0"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Certificate preview"
		onclick={closeCertificate}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				closeCertificate();
			}
		}}
	>
		<button
			type="button"
			class="relative flex h-full max-h-[80dvh] w-full max-w-[80dvw] items-center justify-center"
			onclick={closeCertificate}
		>
			<img
				class="h-full w-full object-contain"
				src={selectedCertificate}
				alt={selectedIndex !== null ? `certificate ${selectedIndex + 1}` : 'certificate'}
				loading="lazy"
			/>
		</button>
	</div>
{/if}
