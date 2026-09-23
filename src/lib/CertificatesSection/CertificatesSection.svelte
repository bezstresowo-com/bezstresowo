<script lang="ts">
	import { getLocale, Locale, t } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { getCertificates } from '$remote/certificates.remote';
	import type { LocalizedCertificate } from '$remote/dto/certificate';
	import { isNil } from 'lodash-es';
	import { onDestroy } from 'svelte';

	let { compact = false }: { compact?: boolean } = $props();
	const isUkrainian = $derived(getLocale() === Locale.ukUA);

	const certificates = $derived(getCertificates({ lang: getLocale() }));

	let selectedCertificate: LocalizedCertificate | null = $state(null);
	let expanded = $state(false);
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

<section class="bg-white py-12 text-primary max-2xl:px-4">
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
		{@const visibleCertificates =
			compact && !expanded ? certificateList.slice(0, 4) : certificateList}

		<!-- An empty gallery (unseeded database) hides the section. -->
		{#if certificateList.length > 0}
			<div class="mx-auto text-center">
				<h2 class="text-3xl font-semibold sm:text-4xl">
					{t.user.pages.home.certificates.title}
				</h2>
			</div>
			<div class="mx-auto mt-6 w-full">
				<div
					class={compact
						? 'grid w-full grid-cols-2 gap-3 md:grid-cols-4'
						: 'grid w-full [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] gap-4'}
				>
					{#each visibleCertificates as certificate, i (certificate.id)}
						<button
							type="button"
							class={compact
								? 'rounded-xl border border-accent/50 bg-primary p-2 transition hover:cursor-pointer hover:border-accent hover:shadow-md sm:p-3'
								: 'max-w-120 rounded-lg border-2 border-accent bg-primary p-4 transition hover:cursor-pointer hover:border-secondary hover:shadow-md'}
							onclick={() => openCertificate(certificate)}
						>
							<img
								class="aspect-video w-full object-contain"
								src={certificate.thumbnailUrl ?? certificate.imageUrl}
								alt={certificateAlt(certificate, i)}
								width="640"
								height="360"
								loading="lazy"
								decoding="async"
							/>
						</button>
					{/each}
				</div>

				{#if compact && certificateList.length > 4}
					<div class="mt-6 text-center">
						<button
							type="button"
							class="inline-flex min-h-11 items-center justify-center rounded-xl border border-accent bg-white px-6 py-2.5 font-semibold text-primary transition hover:bg-background"
							onclick={() => (expanded = !expanded)}
						>
							{#if isUkrainian}
								{expanded ? 'Згорнути сертифікати' : 'Переглянути всі сертифікати'}
							{:else}
								{expanded ? 'Zwiń certyfikaty' : 'Zobacz wszystkie certyfikaty'}
							{/if}
							<i
								class={`fa-solid ml-2 text-sm ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}
								aria-hidden="true"
							></i>
						</button>
					</div>
				{/if}
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
				decoding="async"
			/>
		</button>
	</div>
{/if}
