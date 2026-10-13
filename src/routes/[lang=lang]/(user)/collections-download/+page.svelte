<script lang="ts">
	let { data } = $props();
	const pl = $derived(data.lang === 'pl');
	class DownloadError extends Error {}
	type DownloadState = { pending?: boolean; done?: boolean; error?: string };
	let downloads = $state<Record<number, DownloadState>>({});
	function setDownload(id: number, state: DownloadState) {
		downloads = { ...downloads, [id]: state };
	}
	async function download(event: SubmitEvent, book: { id: number; name: string }) {
		event.preventDefault();
		if (downloads[book.id]?.pending) return;
		const form = event.currentTarget as HTMLFormElement;
		setDownload(book.id, { pending: true });
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 60000);
		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				credentials: 'same-origin',
				headers: { Accept: 'application/pdf' },
				signal: controller.signal
			});
			if (!response.ok) {
				let message = pl
					? 'Nie udało się pobrać pliku. Spróbuj ponownie.'
					: 'Не вдалося завантажити файл. Спробуй ще раз.';
				try {
					const result = await response.json();
					if (typeof result.message === 'string') message = result.message;
				} catch {
					/* Keep the readable fallback. */
				}
				throw new DownloadError(message);
			}
			if (!response.headers.get('content-type')?.includes('application/pdf'))
				throw new DownloadError(
					pl
						? 'Nie otrzymano pliku PDF. Odśwież stronę z linku w e-mailu i spróbuj ponownie.'
						: 'Файл PDF не отримано. Відкрий сторінку з посилання в листі ще раз і повтори спробу.'
				);
			const blob = await response.blob();
			if (!blob.size)
				throw new DownloadError(
					pl ? 'Plik jest pusty. Spróbuj ponownie.' : 'Файл порожній. Спробуй ще раз.'
				);
			const fileUrl = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = fileUrl;
			link.download = book.name + '.pdf';
			document.body.appendChild(link);
			link.click();
			link.remove();
			setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
			setDownload(book.id, { done: true });
		} catch (cause) {
			const message = controller.signal.aborted
				? pl
					? 'Pobieranie trwało zbyt długo. Sprawdź połączenie i spróbuj ponownie.'
					: 'Завантаження триває надто довго. Перевір з’єднання й спробуй ще раз.'
				: cause instanceof DownloadError
					? cause.message
					: pl
						? 'Nie udało się pobrać pliku. Sprawdź połączenie i spróbuj ponownie.'
						: 'Не вдалося завантажити файл. Перевір з’єднання й спробуй ще раз.';
			setDownload(book.id, { error: message });
		} finally {
			clearTimeout(timeout);
		}
	}
</script>

<svelte:head
	><title>{pl ? 'Twoje zbiory' : 'Твої збірки'} | Bezstresowo</title><meta
		name="robots"
		content="noindex,nofollow"
	/></svelte:head
>
<section class="mx-auto max-w-2xl px-5 py-16">
	<h1 class="font-serif text-4xl text-primary">
		{pl ? 'Twoje zbiory już tutaj.' : 'Твої збірки вже тут.'}
	</h1>
	<p class="mt-5">
		{pl
			? 'Dziękuję za zakup! Zapisz pliki na swoim urządzeniu. Każdy zbiór możesz pobrać do trzech razy; otwarcie tej strony nie zużywa próby.'
			: 'Дякую за покупку! Збережи файли на своєму пристрої. Кожну збірку можна завантажити до трьох разів; відкриття цієї сторінки не витрачає спробу.'}
	</p>
	<div class="mt-8 space-y-5">
		{#each data.collections as book (book.id)}
			{@const state = downloads[book.id]}
			<form
				method="POST"
				action="/api/collections/download"
				onsubmit={(event) => download(event, book)}
				class="rounded-xl bg-background p-5"
			>
				<div class="flex flex-wrap items-center justify-between gap-4">
					<span class="font-serif text-xl">{book.name}</span>
					<input type="hidden" name="token" value={data.token} /><input
						type="hidden"
						name="id"
						value={book.id}
					/>
					<button
						type="submit"
						disabled={state?.pending}
						aria-busy={state?.pending ?? false}
						aria-describedby={`download-status-${book.id}`}
						class="flex min-w-44 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-white transition-opacity disabled:cursor-wait disabled:opacity-70"
					>
						{#if state?.pending}<span class="download-spinner" aria-hidden="true"></span>{/if}
						{state?.pending
							? pl
								? 'Pobieranie…'
								: 'Завантаження…'
							: state?.done
								? pl
									? 'Pobierz ponownie'
									: 'Завантажити ще раз'
								: pl
									? 'Pobierz zbiór'
									: 'Завантажити збірку'}
					</button>
				</div>
				<div id={`download-status-${book.id}`} aria-live="polite" aria-atomic="true">
					{#if state?.pending}<p class="mt-3 text-sm">
							{pl
								? 'Przygotowujemy plik PDF. To może potrwać kilka sekund.'
								: 'Готуємо файл PDF. Це може тривати кілька секунд.'}
						</p>
					{:else if state?.error}<p class="mt-3 text-sm text-red-700">{state.error}</p>
					{:else if state?.done}<p class="mt-3 text-sm">
							{pl
								? 'PDF przekazany do pobrania. Sprawdź pobrane pliki w przeglądarce.'
								: 'PDF передано для завантаження. Перевір список завантажень у браузері.'}
						</p>{/if}
				</div>
			</form>
		{/each}
	</div>
	<p class="mt-8 text-sm">
		{pl ? 'Jeśli potrzebujesz pomocy, napisz na' : 'Якщо потрібна допомога, напиши на'}
		<a href="mailto:bezstresowo.org@gmail.com" class="underline">bezstresowo.org@gmail.com</a>.
	</p>
</section>

<style>
	.download-spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid #ffffff60;
		border-top-color: white;
		border-radius: 50%;
		animation: download-spin 0.8s linear infinite;
	}
	@keyframes download-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.download-spinner {
			animation: none;
		}
	}
</style>
