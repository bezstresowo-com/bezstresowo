<script lang="ts">
	import { getLocale, Locale, t } from '$i18n';
	import GuideCard from '$lib/GuideCard/GuideCard.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
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
			{#if getLocale() === Locale.ukUA}
				<article class="flex h-full max-w-md flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div class="relative overflow-hidden bg-primary px-6 py-7 text-white">
						<p class="text-xs font-semibold tracking-wide text-secondary uppercase">Bezstresowo</p>
						<div class="mt-4 text-5xl leading-none font-serif text-accent">?</div>
						<p class="mt-3 max-w-52 text-lg leading-snug font-bold">Коли думки не дають спокою</p>
					</div>
					<div class="flex flex-1 flex-col p-6">
						<p class="text-sm font-semibold text-accent">Безкоштовні матеріали</p>
						<h2 class="mt-3 text-xl leading-snug font-bold text-primary sm:text-2xl">Зрозуміти тривожну спіраль</h2>
						<p class="mt-3 flex-1 leading-relaxed text-slate-600">Короткий матеріал із прикладом і вправою, а також картка, яку можна зберегти в телефоні або роздрукувати.</p>
						<a href="/uk/materials/koly-dumky-ne-daiut-spokoiu" class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none">Переглянути матеріали <span class="ml-3" aria-hidden="true">→</span></a>
					</div>
				</article>
			{/if}
		</div>
	</div>
</section>
