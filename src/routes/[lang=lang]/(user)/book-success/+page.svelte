<script lang="ts">
	import { getLocale, Locale } from '$i18n';
	const pl = $derived(getLocale() === Locale.plPL);
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo
	title={pl
		? 'Dziękuję za zamówienie książki | Bezstresowo'
		: 'Дякую за замовлення книги | Bezstresowo'}
	noindex
/>
<section class="mx-auto max-w-2xl px-6 py-24 text-center text-primary">
	<p class="text-sm font-bold tracking-widest text-accent uppercase">Bezstresowo</p>
	{#if pl}<h1 class="mt-5 font-serif text-4xl">Dziękuję za zamówienie!</h1>
		<p class="mt-6 leading-relaxed">
			Po potwierdzeniu płatności otrzymasz email z przyciskiem „Pobierz książkę”.
		</p>
		<p class="mt-4 leading-relaxed">
			Jeśli wiadomości nie ma, sprawdź foldery Spam i Oferty. Jeśli nie dotrze w ciągu 15 minut,
			napisz na <a href="mailto:bezstresowo.org@gmail.com" class="underline"
				>bezstresowo.org@gmail.com</a
			>.
		</p>
		<a
			href="/pl/materials"
			class="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white"
			>Wróć do materiałów</a
		>{:else}
		<h1 class="mt-5 font-serif text-4xl">Дякую за замовлення!</h1>
		<p class="mt-6 leading-relaxed">
			Після підтвердження оплати на твою електронну адресу надійде лист із кнопкою «Завантажити
			книгу».
		</p>
		<p class="mt-4 leading-relaxed">
			Якщо листа немає, перевір папки «Спам» і «Промоакції». Якщо він не надійшов протягом 15
			хвилин, напиши на <a class="underline" href="mailto:bezstresowo.org@gmail.com"
				>bezstresowo.org@gmail.com</a
			>.
		</p>
		<a
			class="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white"
			href="/uk/materials">Повернутися до матеріалів</a
		>
	{/if}
</section>
