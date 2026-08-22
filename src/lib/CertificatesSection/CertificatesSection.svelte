<script lang="ts">
	import { getLocale, t } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { getCertificates } from '$remote/certificates.remote';
	import type { LocalizedCertificate } from '$remote/dto/certificate';
	import { isNil } from 'lodash-es';
	import { onDestroy } from 'svelte';

	const certificates = $derived(getCertificates({ lang: getLocale() }));

	let selectedCertificate: LocalizedCertificate | null = $state(null);
	let isBodyScrollLocked = false;
	let previousBodyOverflow = '';
	let previousBodyPaddingRight = '';

	/** Alt from the panel, or a generic numbered label when none was entered. */
	function certificateAlt(certificate: LocalizedCertificate, index: number): string {
		return certificate.alt || t.user.a11y.certificateAlt({ number: index + 1 });
	}

	function openCertificate(certificate: LocalizedCertificate) {
		selectedCertificate = certificate;
	}

	function closeCertificate() {
		selectedCertificate = null;
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
		if (isNil(selectedCertificate)) {
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
	<svelte:boundary>
		{#snippet pending()}
			<div class="flex items-center justify-center">
				<LoadingSpinner size="lg" tailwind="mt-5" />
			</div>
		{/snippet}

		{#snippet failed(error, reset)}
			<ErrorNotice {error} {reset} />
		{/snippet}

		{@const certificateList = await certificates}

		<!-- An empty gallery (unseeded database) hides the section. -->
		{#if certificateList.length > 0}
			<div class="mx-auto text-center">
				<h1 class="text-3xl font-semibold sm:text-4xl">
					{t.user.pages.home.certificates.title}
				</h1>
			</div>
			<div class="mx-auto mt-6 w-full">
				<div class="grid w-full [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] gap-4">
					{#each certificateList as certificate, i (certificate.id)}
						<button
							type="button"
							class="max-w-120 rounded-lg border-2 border-accent bg-primary p-4 transition hover:cursor-pointer hover:border-secondary hover:shadow-md"
							onclick={() => openCertificate(certificate)}
						>
							<img
								class="aspect-video object-contain"
								src={certificate.imageUrl}
								alt={certificateAlt(certificate, i)}
								loading="lazy"
							/>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</svelte:boundary>
</section>

{#if selectedCertificate}
	<div
		tabindex="0"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
		role="dialog"
		aria-modal="true"
		aria-label={t.user.a11y.certificatePreview}
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
				src={selectedCertificate.imageUrl}
				alt={selectedCertificate.alt || t.user.a11y.certificatePreview}
				loading="lazy"
			/>
		</button>
	</div>
{/if}
