<script lang="ts">
	import { asset } from '$app/paths';
	import { Locale, path } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo
	title="Програми для самостійної роботи | Bezstresowo"
	description="Практичні програми, робочі зошити та вправи Олесі Гайдук для самостійної роботи зі стосунками."
	noindex
	alternates={[{ locale: Locale.ukUA, path: '/programs' }]}
/>

<section class="min-h-[60vh] bg-background/40 px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto max-w-3xl">
		<header class="max-w-2xl">
			<h1 class="text-3xl leading-tight font-bold text-primary sm:text-4xl">
				Програми для самостійної роботи
			</h1>
			<p class="mt-4 text-lg leading-relaxed text-slate-600">
				Вправи, зошити та аудіо, з якими можна розібратися у своєму запитанні крок за кроком.
			</p>
		</header>

		<div class="mt-9">
			<article
				class="flex flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-md transition duration-300 hover:shadow-xl md:flex-row"
			>
				<div
					class="flex h-56 items-center justify-center bg-primary/5 px-6 py-4 md:h-auto md:w-2/5 md:shrink-0"
				>
					<img
						src={asset('/assets/kryza-chy-kinets-workbook-cover.webp')}
						alt="Обкладинка робочого зошита «Криза чи кінець?»"
						class="h-full max-h-64 max-w-full object-contain"
						loading="lazy"
					/>
				</div>
				<div class="flex min-w-0 flex-1 flex-col p-6 md:py-8">
					<p class="text-sm font-semibold text-accent">
						Самостійна програма · 7 послідовних модулів
					</p>
					<h2 class="mt-3 text-xl leading-snug font-bold text-primary sm:text-2xl">
						Криза чи кінець?
					</h2>
					<p class="mt-3 flex-1 leading-relaxed text-slate-600">
						Наведи лад у думках про стосунки: пройди вправи, відокрем факти від сподівань і ясніше
						побач свої наступні кроки.
					</p>
					<div class="mt-5 flex items-center justify-between gap-4">
						<strong class="text-xl text-primary">19 €</strong>
						<a
							href={path('/kryza-chy-kinets')}
							class="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary transition hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
							>Переглянути програму</a
						>
					</div>
				</div>
			</article>
		</div>
	</div>
</section>
