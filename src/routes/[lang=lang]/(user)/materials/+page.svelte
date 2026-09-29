<script lang="ts">
	import { getLocale, Locale, path, t } from '$i18n';
	import GuideCard from '$lib/GuideCard/GuideCard.svelte';
	import Seo from '$lib/Seo/Seo.svelte';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
</script>

<Seo title={t.meta.materials.title} description={t.meta.materials.description} />

<section class="min-h-[60vh] bg-background/40 px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto max-w-7xl">
		<header class="mx-auto max-w-5xl text-center">
			<h1 class="text-3xl leading-tight font-bold text-primary sm:text-4xl">
				{t.user.pages.materials.pageTitle}
			</h1>
			<p class="mx-auto mt-4 max-w-4xl text-lg leading-relaxed text-slate-600">
				{t.user.pages.materials.pageDescription}
			</p>
		</header>

		<h2 class="mt-12 font-serif text-3xl text-primary">
			{isUkrainian ? 'Безкоштовно' : 'Bezpłatnie'}
		</h2>
		<div class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			<GuideCard />
			{#if isUkrainian}
				<article
					class="flex h-full max-w-md flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="relative min-h-46 overflow-hidden bg-primary px-6 py-7 text-white">
						<div class="absolute top-8 right-6 size-26 rounded-full border border-accent/75"></div>
						<div class="absolute top-11 right-9 size-20 rounded-full border border-white/60"></div>
						<p class="text-xs font-semibold tracking-wide text-secondary uppercase">Bezstresowo</p>
						<p class="relative mt-8 max-w-52 font-serif text-3xl leading-tight">
							Коли думки не дають спокою
						</p>
					</div>
					<div class="flex flex-1 flex-col p-6">
						<p class="text-sm font-semibold text-accent">Безкоштовний гайд і картка</p>
						<h3 class="mt-3 text-xl leading-snug font-bold text-primary sm:text-2xl">
							Зрозуміти тривожну спіраль
						</h3>
						<p class="mt-3 flex-1 leading-relaxed text-slate-600">
							Короткий матеріал із прикладом і вправою, а також картка, яку можна зберегти в
							телефоні або роздрукувати.
						</p>
						<a
							href={path('/materials/koly-dumky-ne-daiut-spokoiu')}
							class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
							>Переглянути матеріали <span class="ml-3" aria-hidden="true">→</span></a
						>
					</div>
				</article>
			{/if}
		</div>

		{#if isUkrainian}
			<h2 class="mt-16 font-serif text-3xl text-primary">Книги та програми</h2>
			<p class="mt-3 max-w-2xl text-slate-600">
				Матеріали для самостійної роботи у власному темпі. На сторінці кожного є докладний опис
				формату й вмісту.
			</p>
			<div class="mt-7 grid gap-7 md:grid-cols-2 lg:gap-8" id="paid-materials">
				<article
					class="flex h-full flex-col overflow-hidden rounded-2xl border border-accent/40 bg-white shadow-sm"
				>
					<div
						class="flex h-96 items-center justify-center bg-background p-6 sm:h-[28rem] lg:h-[32rem] lg:p-8"
					>
						<img
							src="/assets/kryza-chy-kinets-workbook-cover.webp"
							alt="Обкладинка робочого зошита «Криза чи кінець?»"
							class="h-full max-w-full rounded-sm object-contain shadow-lg"
							width="900"
							height="1270"
							loading="lazy"
						/>
					</div>
					<div class="flex flex-1 flex-col px-6 pt-6 pb-7 sm:px-7">
						<p class="text-sm font-semibold tracking-wide text-primary/70">Програма · 19 €</p>
						<h3 class="mt-3 font-serif text-3xl leading-snug text-primary lg:text-4xl">
							Криза чи кінець?
						</h3>
						<p class="mt-3 flex-1 leading-relaxed text-slate-600">
							Коли знову повертаєшся до питання «залишитися чи піти»: 7 послідовних модулів, робочий
							зошит і аудіозаписи.
						</p>
						<a
							href={path('/kryza-chy-kinets')}
							class="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white transition hover:bg-primary/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
							>Переглянути програму</a
						>
					</div>
				</article>
				<article
					class="flex h-full flex-col overflow-hidden rounded-2xl border border-accent/40 bg-white shadow-sm"
				>
					<div
						class="flex h-96 items-center justify-center bg-background p-6 sm:h-[28rem] lg:h-[32rem] lg:p-8"
					>
						<img
							src="/assets/koly-tryvoha-atakuie-cover-ua.webp"
							alt="Обкладинка книги «Коли тривога атакує»"
							class="h-full max-w-full rounded-sm object-contain shadow-lg"
							width="900"
							height="1270"
							loading="lazy"
						/>
					</div>
					<div class="flex flex-1 flex-col px-6 pt-6 pb-7 sm:px-7">
						<p class="text-sm font-semibold tracking-wide text-primary/70">Книга · PDF · 49 zł</p>
						<h3 class="mt-3 font-serif text-3xl leading-snug text-primary lg:text-4xl">
							Коли тривога атакує
						</h3>
						<p class="mt-3 flex-1 leading-relaxed text-slate-600">
							21 практика, щоб придивитися до тривожних думок і напруги та знайти способи підтримки.
							75 сторінок у власному темпі.
						</p>
						<a
							href={path('/materials/koly-tryvoha-atakuie')}
							class="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white transition hover:bg-primary/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
							>Переглянути книгу</a
						>
					</div>
				</article>
			</div>
		{/if}
	</div>
</section>
