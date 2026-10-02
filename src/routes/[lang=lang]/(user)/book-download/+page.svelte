<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';
	let { data } = $props();
</script>

<Seo
	title={data.lang === 'pl' ? 'Twoja książka | Bezstresowo' : 'Твоя книга | Bezstresowo'}
	noindex
/>
<section class="mx-auto max-w-2xl px-6 py-24 text-center text-primary">
	<p class="text-sm font-bold tracking-widest text-accent uppercase">Bezstresowo</p>
	<h1 class="mt-5 font-serif text-4xl">{data.name}</h1>
	{#if data.lang === 'pl'}
		<p class="mt-6 leading-relaxed">
			Link nie ma terminu ważności. Pozostało pobrań: <strong>{data.remaining} z 3</strong>.
		</p>
		{#if data.remaining > 0}<p class="mt-4 leading-relaxed">
				Pobierz PDF i zapisz go na swoim urządzeniu. Otwarcie tej strony nie zużywa pobrania.
				Kliknięcie przycisku wykorzystuje jedną próbę, również jeśli przesyłanie pliku zostanie
				przerwane.
			</p>
			<form method="POST" action="/api/books/download" class="mt-8">
				<input type="hidden" name="token" value={data.token} /><button
					type="submit"
					class="rounded-xl bg-primary px-6 py-3 font-bold text-white">Pobierz książkę</button
				>
			</form>
		{:else}<p class="mt-4 leading-relaxed">
				Wykorzystano trzy pobrania. Jeśli potrzebujesz odzyskać dostęp, napisz na <a
					href="mailto:bezstresowo.org@gmail.com"
					class="underline">bezstresowo.org@gmail.com</a
				>.
			</p>{/if}
	{:else}
		<p class="mt-6 leading-relaxed">
			Посилання не має терміну дії. Залишилось завантажень: <strong>{data.remaining} із 3</strong>.
		</p>
		{#if data.remaining > 0}
			<p class="mt-4 leading-relaxed">
				Натисни кнопку й збережи PDF на своєму пристрої. Відкриття цієї сторінки не витрачає спробу.
				Натискання кнопки використовує одну спробу, навіть якщо передавання файлу перерветься.
			</p>
			<form method="POST" action="/api/books/download" class="mt-8">
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="rounded-xl bg-primary px-6 py-3 font-bold text-white"
					>Завантажити книгу</button
				>
			</form>
		{:else}
			<p class="mt-4 leading-relaxed">
				Усі три спроби використані. Якщо ти втратила файл або завантаження не вдалося, напиши на <a
					class="underline"
					href="mailto:bezstresowo.org@gmail.com">bezstresowo.org@gmail.com</a
				>, щоб відновити доступ.
			</p>
		{/if}
	{/if}
</section>
