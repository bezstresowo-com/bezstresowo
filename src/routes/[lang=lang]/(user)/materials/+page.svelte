<script lang="ts">
	import { getLocale, Locale, path, t } from '$i18n';
	import GuideCard from '$lib/GuideCard/GuideCard.svelte';
	import Seo from '$lib/Seo/Seo.svelte';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
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
			{#if !isUkrainian}<article
					class="flex flex-col rounded-3xl border border-primary/10 bg-white p-7 shadow-md"
				>
					<p class="text-sm font-semibold text-accent">Przewodnik i karta · PDF</p>
					<h3 class="mt-4 font-serif text-3xl text-primary">Kiedy myśli nie dają spokoju</h3>
					<p class="mt-4 flex-1 leading-relaxed text-slate-600">
						Krótki materiał z przykładem i ćwiczeniem oraz karta, którą możesz zapisać w telefonie
						lub wydrukować.
					</p>
					<a
						href="/pl/materials/kiedy-mysli-nie-daja-spokoju"
						class="mt-6 rounded-xl bg-accent px-5 py-3 text-center font-semibold text-primary"
						>Zobacz materiały</a
					>
				</article>{/if}
		</div>

		{#if isUkrainian}
			<h2 class="mt-16 text-center font-serif text-3xl font-semibold text-primary sm:text-4xl">
				Книги та програми
			</h2>
			<p class="mx-auto mt-3 max-w-2xl text-center text-slate-600">
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
							class="h-full w-auto max-w-full rounded-sm object-contain shadow-lg"
							width="900"
							height="1270"
							loading="lazy"
						/>
					</div>
					<div class="flex flex-1 flex-col px-6 pt-6 pb-7 sm:px-7">
						<p class="text-sm font-semibold tracking-wide text-primary/70">Програма · 79 zł</p>
						<h3 class="mt-3 font-serif text-3xl leading-snug text-primary lg:text-4xl">
							<a href={path('/kryza-chy-kinets')} class="underline-offset-4 hover:underline"
								>Криза чи кінець?</a
							>
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
							class="h-full w-auto max-w-full rounded-sm object-contain shadow-lg"
							width="900"
							height="1270"
							loading="lazy"
						/>
					</div>
					<div class="flex flex-1 flex-col px-6 pt-6 pb-7 sm:px-7">
						<p class="text-sm font-semibold tracking-wide text-primary/70">Книга · PDF · 49 zł</p>
						<h3 class="mt-3 font-serif text-3xl leading-snug text-primary lg:text-4xl">
							<a
								href={path('/materials/koly-tryvoha-atakuie')}
								class="underline-offset-4 hover:underline">Коли тривога атакує</a
							>
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
		{#if !isUkrainian}<h2
				class="mt-16 text-center font-serif text-3xl font-semibold text-primary sm:text-4xl"
			>
				Książki i programy
			</h2>
			<div class="mt-6 grid gap-6 md:grid-cols-2">
				<article class="flex flex-col overflow-hidden rounded-2xl border border-accent/40 bg-white">
					<div class="flex h-96 items-center justify-center bg-background p-6">
						<img
							src="/assets/kiedy-lek-atakuje-cover-pl.webp"
							alt="Kiedy lęk atakuje — okładka książki"
							class="h-full w-auto max-w-full object-contain shadow-lg"
							width="893"
							height="1263"
							loading="lazy"
						/>
					</div>
					<div class="p-7">
						<p class="text-sm text-primary/70">Książka · PDF · 49 zł</p>
						<h3 class="mt-3 font-serif text-3xl text-primary">
							<a href="/pl/materials/kiedy-lek-atakuje">Kiedy lęk atakuje</a>
						</h3>
						<p class="mt-4 leading-relaxed text-slate-600">
							21 ćwiczeń, wyjaśnienia i miejsce na notatki. 75 stron do pracy we własnym tempie.
						</p>
						<a
							href="/pl/materials/kiedy-lek-atakuje"
							class="mt-6 block rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white"
							>Zobacz książkę</a
						>
					</div>
				</article>
				<article class="flex flex-col overflow-hidden rounded-2xl border border-accent/40 bg-white">
					<div class="flex h-96 items-center justify-center bg-background p-6">
						<img
							src="/assets/kryzys-czy-koniec-workbook-cover.webp"
							alt="Kryzys czy koniec — okładka zeszytu ćwiczeń"
							class="h-full w-auto max-w-full object-contain shadow-lg"
							width="900"
							height="1270"
							loading="lazy"
						/>
					</div>
					<div class="p-7">
						<p class="text-sm text-primary/70">Program · 79 zł</p>
						<h3 class="mt-3 font-serif text-3xl text-primary">Kryzys czy koniec?</h3>
						<p class="mt-4 leading-relaxed text-slate-600">
							7 modułów, zeszyt ćwiczeń i nagrania audio. Uporządkuj to, co dzieje się w Twojej
							relacji, bez presji na natychmiastową decyzję.
						</p>
						<a
							href="/pl/kryzys-czy-koniec"
							class="mt-6 block rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white"
							>Zobacz program</a
						>
					</div>
				</article>
			</div>{/if}
	</div>
</section>
