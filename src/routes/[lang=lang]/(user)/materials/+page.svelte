<script lang="ts">
	import { getLocale, Locale, t } from '$i18n';
	import GuideCard from '$lib/GuideCard/GuideCard.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import AnxietySpiral from '$lib/Materials/AnxietySpiral.svelte';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	const paidMaterials = $derived(
		isUkrainian
			? [
					{
						title: 'Криза чи кінець?',
						eyebrow: 'Програма · 79 zł',
						cover: '/assets/kryza-chy-kinets-workbook-cover.webp',
						alt: 'Обкладинка робочого зошита «Криза чи кінець?»',
						href: '/uk/kryza-chy-kinets',
						description:
							'Коли знову повертаєшся до питання «залишитися чи піти»: 7 послідовних модулів, робочий зошит і аудіозаписи.',
						cta: 'Переглянути програму'
					},
					{
						title: 'Коли тривога атакує',
						eyebrow: 'Книга · PDF · 49 zł',
						cover: '/assets/koly-tryvoha-atakuie-cover-ua.webp',
						alt: 'Обкладинка книги «Коли тривога атакує»',
						href: '/uk/materials/koly-tryvoha-atakuie',
						description:
							'21 практика, щоб придивитися до тривожних думок і напруги та знайти способи підтримки. 75 сторінок у власному темпі.',
						cta: 'Переглянути книгу'
					}
				]
			: [
					{
						title: 'Kryzys czy koniec?',
						eyebrow: 'Program · 79 zł',
						cover: '/assets/kryzys-czy-koniec-workbook-cover.webp',
						alt: 'Okładka zeszytu ćwiczeń „Kryzys czy koniec?”',
						href: '/pl/kryzys-czy-koniec',
						description:
							'Kiedy wciąż wracasz do pytania „zostać czy odejść”: 7 kolejnych modułów, zeszyt ćwiczeń i nagrania audio.',
						cta: 'Zobacz program'
					},
					{
						title: 'Kiedy lęk atakuje',
						eyebrow: 'Książka · PDF · 49 zł',
						cover: '/assets/kiedy-lek-atakuje-cover-pl.webp',
						alt: 'Okładka książki „Kiedy lęk atakuje”',
						href: '/pl/materials/kiedy-lek-atakuje',
						description:
							'21 ćwiczeń, by przyjrzeć się niepokojącym myślom i napięciu oraz znaleźć sposoby dbania o siebie. 75 stron do pracy we własnym tempie.',
						cta: 'Zobacz książkę'
					}
				]
	);
</script>

<Seo title={t.meta.materials.title} description={t.meta.materials.description} />

<section class="min-h-[60vh] bg-background/40 px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto max-w-7xl">
		<header class="mx-auto max-w-full text-center">
			<h1 class="text-3xl leading-tight font-bold text-primary sm:text-4xl">
				{t.user.pages.materials.pageTitle}
			</h1>
			<p class="mx-auto mt-4 max-w-full text-base leading-relaxed text-slate-600">
				{t.user.pages.materials.pageDescription}
			</p>
		</header>

		<h2 class="mt-12 text-center font-serif text-3xl font-semibold text-primary sm:text-4xl">
			{isUkrainian ? 'Безкоштовно' : 'Bezpłatnie'}
		</h2>
		<div class="mt-6 grid gap-6 md:grid-cols-2">
			<GuideCard />
			<article
				class="flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="relative flex h-52 items-start overflow-hidden bg-primary px-6 py-7 text-white">
					<AnxietySpiral
						class="pointer-events-none absolute -right-4 -bottom-9 h-56 w-72 opacity-45"
					/>
					<div class="relative">
						<p class="text-xs font-semibold tracking-wide text-secondary uppercase">Bezstresowo</p>
						<p class="mt-6 max-w-60 font-serif text-3xl leading-tight">
							{isUkrainian ? 'Коли думки не дають спокою' : 'Kiedy myśli nie dają spokoju'}
						</p>
					</div>
				</div>
				<div class="flex flex-1 flex-col p-6">
					<p class="text-sm font-semibold text-accent">
						{isUkrainian ? 'Безкоштовний гайд і картка' : 'Bezpłatny przewodnik i karta'}
					</p>
					<h3 class="mt-3 text-xl leading-snug font-bold text-primary sm:text-2xl">
						{isUkrainian ? 'Зрозуміти тривожну спіраль' : 'Kiedy jedna obawa prowadzi do kolejnej'}
					</h3>
					<p class="mt-3 flex-1 leading-relaxed text-slate-600">
						{isUkrainian
							? 'Короткий матеріал із прикладом і вправою, а також картка, яку можна зберегти в телефоні або роздрукувати.'
							: 'Krótki materiał z przykładem i ćwiczeniem oraz karta, którą możesz zapisać w telefonie lub wydrukować.'}
					</p>
					<a
						href={isUkrainian
							? '/uk/materials/koly-dumky-ne-daiut-spokoiu'
							: '/pl/materials/kiedy-mysli-nie-daja-spokoju'}
						class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
						>{isUkrainian ? 'Переглянути матеріали' : 'Zobacz materiały'}
						<span class="ml-3" aria-hidden="true">→</span></a
					>
				</div>
			</article>
		</div>
		<h2 class="mt-16 text-center font-serif text-3xl font-semibold text-primary sm:text-4xl">
			{isUkrainian ? 'Книги та програми' : 'Książki i programy'}
		</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-slate-600">
			{isUkrainian
				? 'Матеріали для самостійної роботи у власному темпі. На сторінці кожного є докладний опис формату й вмісту.'
				: 'Materiały do samodzielnej pracy we własnym tempie. Na stronie każdego z nich znajdziesz dokładny opis formatu i zawartości.'}
		</p>
		<div class="mt-7 grid gap-7 md:grid-cols-2 lg:gap-8" id="paid-materials">
			{#each paidMaterials as material (material.href)}
				<article
					class="flex h-full flex-col overflow-hidden rounded-2xl border border-accent/40 bg-white shadow-sm"
				>
					<div
						class="flex h-96 items-center justify-center bg-background p-6 sm:h-[28rem] lg:h-[32rem] lg:p-8"
					>
						<img
							src={material.cover}
							alt={material.alt}
							class="h-full w-auto max-w-full rounded-sm object-contain shadow-lg"
							width="900"
							height="1270"
							loading="lazy"
						/>
					</div>
					<div class="flex flex-1 flex-col px-6 pt-6 pb-7 sm:px-7">
						<p class="text-sm font-semibold tracking-wide text-primary/70">{material.eyebrow}</p>
						<h3 class="mt-3 font-serif text-3xl leading-snug text-primary lg:text-4xl">
							<a href={material.href} class="underline-offset-4 hover:underline">{material.title}</a
							>
						</h3>
						<p class="mt-3 flex-1 leading-relaxed text-slate-600">{material.description}</p>
						<a
							href={material.href}
							class="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white transition hover:bg-primary/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
							>{material.cta}</a
						>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
