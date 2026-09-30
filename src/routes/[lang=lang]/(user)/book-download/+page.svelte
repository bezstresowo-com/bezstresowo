<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';
	let { data } = $props();
</script>

<Seo title="Твоя книга | Bezstresowo" noindex />
<section class="mx-auto max-w-2xl px-6 py-24 text-center text-primary">
	<p class="text-sm font-bold tracking-widest text-accent uppercase">Bezstresowo</p>
	<h1 class="mt-5 font-serif text-4xl">Коли тривога атакує</h1>
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
</section>
