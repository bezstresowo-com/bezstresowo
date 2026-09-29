<script lang="ts">
	import { getLocale, Locale, path } from '$i18n';
	const isUkrainian = $derived(getLocale() === Locale.ukUA);
</script>

<section id="services" class="scroll-mt-24 bg-background px-4 py-12 text-primary sm:px-6 sm:py-14">
	<div class="mx-auto max-w-6xl text-center">
		<p class="text-sm font-semibold tracking-wide text-primary/70">
			{isUkrainian
				? 'Індивідуально та для пар · онлайн і в Лодзі'
				: 'Indywidualnie i dla par · online i w Łodzi'}
		</p>
		<h2 class="mt-3 text-3xl font-semibold sm:text-4xl">
			{isUkrainian ? 'З чим ти приходиш на терапію?' : 'Z czym przychodzisz na terapię?'}
		</h2>
		<p class="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
			{isUkrainian
				? 'Можливо, ти вже знаєш, що хочеш обговорити. А може, поки лише відчуваєш, що тобі важко. Переглянь, із чим я працюю, та як відбуваються зустрічі.'
				: 'Być może już wiesz, o czym chcesz porozmawiać. A może na razie czujesz tylko, że jest Ci trudno. Sprawdź, z jakimi tematami pracuję i jak wyglądają spotkania.'}
		</p>
		<a
			href={path('/services')}
			class="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 font-semibold transition hover:bg-secondary"
		>
			{isUkrainian ? 'Переглянути послуги та вартість' : 'Zobacz usługi i ceny'}
			<i class="fa-solid fa-arrow-right ml-3 text-sm" aria-hidden="true"></i>
		</a>
	</div>
</section>
