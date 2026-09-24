<script lang="ts">
	import { getLocale, Locale, path, t } from '$i18n';
	import GuideCard from '$lib/GuideCard/GuideCard.svelte';
	import Seo from '$lib/Seo/Seo.svelte';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	const programUrl = $derived(path('/kryza-chy-kinets'));
</script>

<Seo title={t.meta.materials.title} description={t.meta.materials.description} />

<section class="min-h-[60vh] bg-background/40 px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto max-w-7xl">
		<header class="max-w-2xl">
			<h1 class="text-3xl leading-tight font-bold text-primary sm:text-4xl">
				{t.user.pages.materials.pageTitle}
			</h1>
			<p class="mt-4 text-lg leading-relaxed text-slate-600">
				{t.user.pages.materials.pageDescription}
			</p>
		</header>

		<div class="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			<GuideCard />
		</div>

		{#if isUkrainian}
			<section
				class="mt-8 max-w-4xl overflow-hidden rounded-3xl border border-accent/35 bg-white shadow-sm"
				aria-labelledby="relationship-program-title"
			>
				<div class="grid items-center md:grid-cols-[150px_1fr_auto]">
					<div
						class="flex h-full min-h-32 items-center justify-center gap-3 bg-primary px-6 py-7 text-white"
						aria-hidden="true"
					>
						<span class="font-serif text-4xl text-accent">17</span>
						<i class="fa-solid fa-arrow-right text-secondary"></i>
						<span class="font-serif text-4xl text-accent">7</span>
					</div>

					<div class="px-6 py-6 md:py-7">
						<p class="text-xs font-bold tracking-wider text-accent uppercase">
							Платна програма · наступний крок
						</p>
						<h2
							id="relationship-program-title"
							class="mt-2 text-xl font-bold text-primary sm:text-2xl"
						>
							Від 17 запитань до яснішої картини
						</h2>
						<p class="mt-2 leading-relaxed text-slate-600">
							Якщо гайд допоміг побачити, що відбувається, але запитання «залишатися чи йти?» досі
							не дає спокою, програма «Криза чи кінець?» проведе далі через 7 послідовних модулів.
						</p>
						<p class="mt-3 text-sm font-medium text-primary/65">
							Workbook · Мапа рішення · 5 коротких аудіо · стартова ціна 79 zł
						</p>
					</div>

					<div class="px-6 pb-6 md:pr-7 md:pb-0 md:pl-0">
						<a
							href={programUrl}
							class="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 font-bold whitespace-nowrap text-primary transition hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
						>
							Переглянути програму
							<i class="fa-solid fa-arrow-right ml-3" aria-hidden="true"></i>
						</a>
					</div>
				</div>
			</section>
		{/if}
	</div>
</section>
