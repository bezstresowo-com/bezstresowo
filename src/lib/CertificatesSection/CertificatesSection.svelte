<script lang="ts">
	import { translate } from '$i18n';
	import { CERTIFICATES } from './certificates';

	let selectedCertificate: string | null = $state(null);
	let selectedIndex: number | null = $state(null);

	function openCertificate(certificate: string, index: number) {
		selectedCertificate = certificate;
		selectedIndex = index;
	}

	function closeCertificate() {
		selectedCertificate = null;
		selectedIndex = null;
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') closeCertificate();
	}}
/>

<section class="bg-white pt-12 text-primary max-xl:px-4">
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
