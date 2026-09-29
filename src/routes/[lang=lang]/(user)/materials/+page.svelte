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
			<p class="mt-8 max-w-2xl leading-relaxed text-slate-600">
				Для глибшої роботи зі стосунками є
				<a
					href={programUrl}
					class="font-semibold text-primary underline decoration-accent underline-offset-4 hover:text-accent focus:outline-offset-4"
					>програма «Криза чи кінець?»</a
				>.
			</p>
		{/if}
	</div>
</section>
