<script lang="ts">
	import { resolve } from '$app/paths';
	import { translate } from '$i18n';

	const prefix = 'user.pages.termsOfService';
	const pdfUrl = resolve(
		'/documents/Regulamin - Centrum Psychoterapii Bezstresowo - Olesya Haiduk.pdf'
	);
</script>

<svelte:head>
	<title>{$translate(`${prefix}.title`)} - Bezstresowo</title>
	<meta name="description" content={$translate(`${prefix}.description`)} />
</svelte:head>

<div class="min-h-screen">
	<!-- Header Section -->
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90"
	>
		<h1 class="mx-auto text-center text-4xl font-bold text-white sm:text-5xl">
			{$translate(`${prefix}.title`)}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-center text-secondary">
			{$translate(`${prefix}.subtitle`)}
		</p>
	</div>

	<!-- Content Section -->
	<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-8 shadow-md">
			<!-- §1 Postanowienia ogólne -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.general.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.general.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.general.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.general.items.2`)}</li>
				</ol>
			</section>

			<!-- §2 Zakres świadczonych usług -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.scope.title`)}
				</h2>
				<p class="mb-3 text-primary">
					{$translate(`${prefix}.sections.scope.intro`)}
				</p>
				<p class="mb-2 font-semibold text-primary">
					{$translate(`${prefix}.sections.scope.servicesTitle`)}
				</p>
				<ul class="mb-4 ml-6 list-disc space-y-1 text-primary">
					<li>{$translate(`${prefix}.sections.scope.services.0`)}</li>
					<li>{$translate(`${prefix}.sections.scope.services.1`)}</li>
					<li>{$translate(`${prefix}.sections.scope.services.2`)}</li>
					<li>{$translate(`${prefix}.sections.scope.services.3`)}</li>
					<li>{$translate(`${prefix}.sections.scope.services.4`)}</li>
					<li>{$translate(`${prefix}.sections.scope.services.5`)}</li>
				</ul>
				<p class="mb-2 font-semibold text-primary">
					{$translate(`${prefix}.sections.scope.notProvidedTitle`)}
				</p>
				<ul class="ml-6 list-disc space-y-1 text-primary">
					<li>{$translate(`${prefix}.sections.scope.notProvided.0`)}</li>
					<li>{$translate(`${prefix}.sections.scope.notProvided.1`)}</li>
					<li>{$translate(`${prefix}.sections.scope.notProvided.2`)}</li>
				</ul>
			</section>

			<!-- §3 Charakter usług psychoterapeutycznych -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.nature.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.nature.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.nature.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.nature.items.2`)}</li>
					<li>{$translate(`${prefix}.sections.nature.items.3`)}</li>
				</ol>
			</section>

			<!-- §4 Terapia traumy i bezpieczeństwo Klienta -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.trauma.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.trauma.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.trauma.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.trauma.items.2`)}</li>
				</ol>
			</section>

			<!-- §5 Zasady współpracy terapeutycznej -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.cooperation.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.cooperation.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.cooperation.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.cooperation.items.2`)}</li>
					<li>{$translate(`${prefix}.sections.cooperation.items.3`)}</li>
				</ol>
			</section>

			<!-- §6 Umawianie i odwoływanie wizyt -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.appointments.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.appointments.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.appointments.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.appointments.items.2`)}</li>
					<li>{$translate(`${prefix}.sections.appointments.items.3`)}</li>
				</ol>
			</section>

			<!-- §7 Opłaty -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.fees.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.fees.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.fees.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.fees.items.2`)}</li>
				</ol>
			</section>

			<!-- §8 Sesje online -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.online.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.online.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.online.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.online.items.2`)}</li>
				</ol>
			</section>

			<!-- §9 Poufność i tajemnica zawodowa -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.confidentiality.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.confidentiality.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.confidentiality.items.1`)}</li>
				</ol>
			</section>

			<!-- §10 Odpowiedzialność -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.liability.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.liability.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.liability.items.1`)}</li>
				</ol>
			</section>

			<!-- §11 Postanowienia końcowe -->
			<section class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-primary">
					{$translate(`${prefix}.sections.final.title`)}
				</h2>
				<ol class="ml-6 list-decimal space-y-2 text-primary">
					<li>{$translate(`${prefix}.sections.final.items.0`)}</li>
					<li>{$translate(`${prefix}.sections.final.items.1`)}</li>
					<li>{$translate(`${prefix}.sections.final.items.2`)}</li>
				</ol>
			</section>

			<!-- Download PDF Section -->
			<section class="mt-10 rounded-lg bg-primary/5 p-6">
				<h3 class="mb-3 text-xl font-semibold text-primary">
					{$translate(`${prefix}.download.title`)}
				</h3>
				<p class="mb-2 text-primary">
					{$translate(`${prefix}.download.description`)}
				</p>
				<p class="mb-4 text-sm text-primary/70 italic">
					{$translate(`${prefix}.download.languageNote`)}
				</p>
				<a
					href={pdfUrl}
					download
					rel="external"
					class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
				>
					<i class="fa-solid fa-download"></i>
					{$translate(`${prefix}.download.button`)}
				</a>
			</section>
		</div>
	</div>
</div>
