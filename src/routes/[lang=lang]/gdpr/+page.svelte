<script lang="ts">
	import { asset } from '$app/paths';
	import { t } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';

	const prefix = 'user.pages.gdpr';
	const pdfUrl = asset(
		'/documents/Klauzula RODO - Centrum Psychoterapii Bezstresowo - Olesya Haiduk.pdf'
	);
</script>

<!-- Legal pages carry no search value - keep them out of the index. -->
<Seo title="meta.gdpr.title" description="meta.gdpr.description" noindex />

<div class="min-h-screen">
	<!-- Header Section -->
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90 p-2"
	>
		<h1 class="mx-auto text-center text-4xl font-bold text-white sm:text-5xl">
			{t(`${prefix}.title`)}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-center text-secondary">
			{t(`${prefix}.subtitle`)}
		</p>
	</div>

	<!-- Content Section -->
	<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-8 shadow-md">
			<!-- Section 1: Administrator -->
			<section class="mb-8">
				<p class="text-lg text-primary">
					{t(`${prefix}.sections.controller.title`)}
				</p>
			</section>

			<!-- Section 2: Purpose -->
			<section class="mb-8">
				<p class="mb-3 text-lg text-primary">
					{t(`${prefix}.sections.purpose.title`)}
				</p>
				<ul class="ml-6 list-disc space-y-1 text-primary">
					<li>{t(`${prefix}.sections.purpose.items.0`)}</li>
					<li>{t(`${prefix}.sections.purpose.items.1`)}</li>
					<li>{t(`${prefix}.sections.purpose.items.2`)}</li>
				</ul>
			</section>

			<!-- Section 3: Legal Basis -->
			<section class="mb-8">
				<p class="text-lg text-primary">
					{t(`${prefix}.sections.legal.title`)}
				</p>
			</section>

			<!-- Section 4: Recipients -->
			<section class="mb-8">
				<p class="text-lg text-primary">
					{t(`${prefix}.sections.recipients.title`)}
				</p>
			</section>

			<!-- Section 5: Rights -->
			<section class="mb-8">
				<p class="text-lg text-primary">
					{t(`${prefix}.sections.rights.title`)}
				</p>
			</section>

			<!-- Section 6: Complaint -->
			<section class="mb-8">
				<p class="text-lg text-primary">
					{t(`${prefix}.sections.complaint.title`)}
				</p>
			</section>

			<!-- Download PDF Section -->
			<section class="mt-10 rounded-lg bg-primary/5 p-6">
				<h3 class="mb-3 text-xl font-semibold text-primary">
					{t(`${prefix}.download.title`)}
				</h3>
				<p class="mb-2 text-primary">
					{t(`${prefix}.download.description`)}
				</p>
				<p class="mb-4 text-sm text-primary/70 italic">
					{t(`${prefix}.download.languageNote`)}
				</p>
				<a
					href={pdfUrl}
					download
					rel="external"
					class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
				>
					<i class="fa-solid fa-download"></i>
					{t(`${prefix}.download.button`)}
				</a>
			</section>
		</div>
	</div>
</div>
