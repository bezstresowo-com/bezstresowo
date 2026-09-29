<script lang="ts">
	import { asset } from '$app/paths';
	import { getLocale, Locale, path } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { createShopCheckout } from '$remote/checkout.remote';
	import { getProducts } from '$remote/products.remote';
	import { formatMoney } from '$shared/global/functions/format-money';
	import toast, { Toaster } from 'svelte-5-french-toast';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	const products = $derived(getProducts({ lang: getLocale(), siteLocation: 'registrations' }));
	let purchaseLoadingId: string | null = $state(null);

	async function payForAgreedSession(productId: string) {
		purchaseLoadingId = productId;
		try {
			const session = await createShopCheckout({ productId, lang: getLocale(), quantity: 1 });
			if (session.url) window.location.href = session.url;
			else
				toast.error(
					isUkrainian ? 'Не вдалося відкрити оплату.' : 'Nie udało się otworzyć płatności.'
				);
		} catch (error) {
			console.error('Payment error:', error);
			toast.error(
				isUkrainian ? 'Не вдалося відкрити оплату.' : 'Nie udało się otworzyć płatności.'
			);
		} finally {
			purchaseLoadingId = null;
		}
	}
</script>

<Seo
	title={isUkrainian
		? 'Послуги та консультації | Bezstresowo'
		: 'Usługi i konsultacje | Bezstresowo'}
	description={isUkrainian
		? 'Індивідуальна та парна психотерапія. Формат, вартість, запис і оплата консультацій.'
		: 'Psychoterapia indywidualna i terapia par. Formy pracy, ceny, zapisy i płatności.'}
/>
<Toaster />

<div class="bg-background/40 text-primary">
	<section class="bg-primary px-5 py-16 text-white sm:px-8">
		<div class="mx-auto max-w-7xl">
			<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">Bezstresowo</p>
			<h1 class="mt-4 font-serif text-4xl sm:text-5xl">{isUkrainian ? 'Послуги' : 'Usługi'}</h1>
			<p class="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
				{isUkrainian
					? 'Індивідуальна робота, консультації для пар і батьків. Обери напрям, щоб побачити вартість і перейти до запису.'
					: 'Psychoterapia indywidualna, terapia par i konsultacje dla rodziców. Wybierz formę pracy, sprawdź cenę i przejdź do zapisu.'}
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-5 py-14 sm:px-8">
		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			<svelte:boundary>
				{#snippet pending()}
					<div class="col-span-full flex justify-center py-12"><LoadingSpinner size="lg" /></div>
				{/snippet}
				{#snippet failed(error, reset)}
					<div class="col-span-full"><ErrorNotice {error} {reset} /></div>
				{/snippet}

				{@const serviceProducts = await products}
				{#each serviceProducts as product (product.id)}
					<article
						class="flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm"
					>
						<img
							src={product.imageUrl ?? asset('/assets/shop-image-placeholder.svg')}
							alt=""
							class="h-44 w-full object-cover"
							loading="lazy"
						/>
						<div class="flex flex-1 flex-col p-6">
							<h2 class="text-xl leading-snug font-semibold">{product.name}</h2>
							<p class="mt-3 flex-1 leading-relaxed text-slate-600">{product.description}</p>
							<p class="mt-5 text-2xl font-semibold text-primary">
								{formatMoney(product.priceInMinorUnits, product.currency, getLocale())}
							</p>
							<a
								href={path('/registrations')}
								class="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary hover:bg-secondary"
								>{isUkrainian ? 'Записатися' : 'Umów konsultację'}</a
							>
							{#if product.siteLocations.includes('shop')}
								<button
									type="button"
									class="mt-3 min-h-11 cursor-pointer rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background disabled:cursor-wait disabled:opacity-60"
									disabled={purchaseLoadingId === product.id}
									onclick={() => payForAgreedSession(product.id)}
									>{purchaseLoadingId === product.id
										? '…'
										: isUkrainian
											? 'Оплатити узгоджену зустріч'
											: 'Opłać uzgodnione spotkanie'}</button
								>
							{/if}
						</div>
					</article>
				{/each}
			</svelte:boundary>
		</div>
		<div class="mt-12 rounded-3xl border border-primary/10 bg-white p-7 sm:p-9">
			<h2 class="font-serif text-2xl">
				{isUkrainian ? 'Як відбувається запис' : 'Jak wygląda zapis'}
			</h2>
			<p class="mt-3 max-w-3xl leading-relaxed text-slate-600">
				{isUkrainian
					? 'У чинній формі ти обираєш консультацію, залишаєш контакт і переходиш до оплати. Після підтвердження я зв’яжуся з тобою, щоб узгодити час. Якщо зустріч уже домовлена, її можна оплатити окремою кнопкою на картці послуги.'
					: 'W obecnym formularzu wybierasz konsultację, podajesz kontakt i przechodzisz do płatności. Po jej potwierdzeniu skontaktuję się z Tobą, aby ustalić termin. Uzgodnione wcześniej spotkanie możesz opłacić osobnym przyciskiem na karcie usługi.'}
			</p>
		</div>
	</section>
</div>
