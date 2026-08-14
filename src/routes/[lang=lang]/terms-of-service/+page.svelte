<script lang="ts">
	import { asset } from '$app/paths';
	import { t } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';

	const prefix = 'user.pages.termsOfService';
	const pdfUrl = asset(
		'/documents/Regulamin - Centrum Psychoterapii Bezstresowo - Olesya Haiduk.pdf'
	);
</script>

<!-- Legal pages carry no search value - keep them out of the index. -->
<Seo
	title="meta.termsOfService.title"
	description="meta.termsOfService.description"
	noindex
/>

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
			<!-- §1 Postanowienia ogólne -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.general.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.general.items.0`)}</li>
					<li>{t(`${prefix}.sections.general.items.1`)}</li>
					<li>{t(`${prefix}.sections.general.items.2`)}</li>
				</ol>
			</section>

			<!-- §2 Zakres świadczonych usług -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.scope.title`)}
				</h2>
				<p class="mb-3 text-primary">
					{t(`${prefix}.sections.scope.intro`)}
				</p>
				<p class="mb-2 font-semibold text-primary">
					{t(`${prefix}.sections.scope.servicesTitle`)}
				</p>
				<ul class="mb-4 ml-6 list-disc space-y-1 text-primary">
					<li>{t(`${prefix}.sections.scope.services.0`)}</li>
					<li>{t(`${prefix}.sections.scope.services.1`)}</li>
					<li>{t(`${prefix}.sections.scope.services.2`)}</li>
					<li>{t(`${prefix}.sections.scope.services.3`)}</li>
					<li>{t(`${prefix}.sections.scope.services.4`)}</li>
					<li>{t(`${prefix}.sections.scope.services.5`)}</li>
				</ul>
				<p class="mb-2 font-semibold text-primary">
					{t(`${prefix}.sections.scope.notProvidedTitle`)}
				</p>
				<ul class="ml-6 list-disc space-y-1 text-primary">
					<li>{t(`${prefix}.sections.scope.notProvided.0`)}</li>
					<li>{t(`${prefix}.sections.scope.notProvided.1`)}</li>
					<li>{t(`${prefix}.sections.scope.notProvided.2`)}</li>
				</ul>
			</section>

			<!-- §3 Charakter usług psychoterapeutycznych -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.nature.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.nature.items.0`)}</li>
					<li>{t(`${prefix}.sections.nature.items.1`)}</li>
					<li>{t(`${prefix}.sections.nature.items.2`)}</li>
					<li>{t(`${prefix}.sections.nature.items.3`)}</li>
				</ol>
			</section>

			<!-- §4 Terapia traumy i bezpieczeństwo Klienta -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.trauma.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.trauma.items.0`)}</li>
					<li>{t(`${prefix}.sections.trauma.items.1`)}</li>
					<li>{t(`${prefix}.sections.trauma.items.2`)}</li>
				</ol>
			</section>

			<!-- §5 Zasady współpracy terapeutycznej -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.cooperation.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.cooperation.items.0`)}</li>
					<li>{t(`${prefix}.sections.cooperation.items.1`)}</li>
					<li>{t(`${prefix}.sections.cooperation.items.2`)}</li>
					<li>{t(`${prefix}.sections.cooperation.items.3`)}</li>
				</ol>
			</section>

			<!-- §6 Umawianie i odwoływanie wizyt -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.appointments.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.appointments.items.0`)}</li>
					<li>{t(`${prefix}.sections.appointments.items.1`)}</li>
					<li>{t(`${prefix}.sections.appointments.items.2`)}</li>
					<li>{t(`${prefix}.sections.appointments.items.3`)}</li>
				</ol>
			</section>

			<!-- §7 Opłaty -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.fees.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.fees.items.0`)}</li>
					<li>{t(`${prefix}.sections.fees.items.1`)}</li>
					<li>{t(`${prefix}.sections.fees.items.2`)}</li>
				</ol>
			</section>

			<!-- §8 Sesje online -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.online.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.online.items.0`)}</li>
					<li>{t(`${prefix}.sections.online.items.1`)}</li>
					<li>{t(`${prefix}.sections.online.items.2`)}</li>
				</ol>
			</section>

			<!-- §9 Poufność i tajemnica zawodowa -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.confidentiality.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.confidentiality.items.0`)}</li>
					<li>{t(`${prefix}.sections.confidentiality.items.1`)}</li>
				</ol>
			</section>

			<!-- §10 Odpowiedzialność -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.liability.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.liability.items.0`)}</li>
					<li>{t(`${prefix}.sections.liability.items.1`)}</li>
				</ol>
			</section>

			<!-- §11 Postanowienia końcowe -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{t(`${prefix}.sections.final.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{t(`${prefix}.sections.final.items.0`)}</li>
					<li>{t(`${prefix}.sections.final.items.1`)}</li>
					<li>{t(`${prefix}.sections.final.items.2`)}</li>
				</ol>
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
