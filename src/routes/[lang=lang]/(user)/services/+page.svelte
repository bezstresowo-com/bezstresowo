<script lang="ts">
	import { getLocale, Locale, path, translateKey } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { OFFERED_SERVICES } from '$lib/ServicesSection/model';
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
					? 'Обери напрям роботи, щоб прочитати докладний опис. Нижче знайдеш формати консультацій, вартість і запис.'
					: 'Wybierz obszar pracy, aby przeczytać szczegółowy opis. Niżej znajdziesz formy konsultacji, ceny i zapisy.'}
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-5 py-14 sm:px-8">
		<h2 class="font-serif text-3xl">{isUkrainian ? 'Напрями роботи' : 'Obszary pracy'}</h2>
		<div class="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#each OFFERED_SERVICES as service (service.slug)}
				<article class="flex h-full flex-col rounded-3xl border border-accent/50 bg-white p-7 shadow-sm">
					<i class={`text-3xl text-accent ${service.icon}`} aria-hidden="true"></i>
					<h3 class="mt-5 text-xl font-semibold">{translateKey(`${service.prefix}.title`)}</h3>
					<p class="mt-3 flex-1 leading-relaxed text-slate-600">
						{translateKey(`${service.prefix}.description`)}
					</p>
					<a
						href={path(`/${service.slug}`)}
						class="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-accent px-5 py-2.5 text-center font-semibold text-primary hover:bg-background"
					>
						{isUkrainian ? 'Дізнатися більше' : 'Dowiedz się więcej'}
						<i class="fa-solid fa-arrow-right ml-2 text-sm" aria-hidden="true"></i>
					</a>
				</article>
			{/each}
		</div>
		<h2 class="mt-16 font-serif text-3xl">
			{isUkrainian ? 'Формати та вартість консультацій' : 'Formy i ceny konsultacji'}
		</h2>
		<div class="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			<svelte:boundary>
				{#snippet pending()}
					<div class="col-span-full flex justify-center py-12"><LoadingSpinner size="lg" /></div>
				{/snippet}
				{#snippet failed(error, reset)}
					<div class="col-span-full"><ErrorNotice {error} {reset} /></div>
				{/snippet}

				{@const serviceProducts = await products}
				{#each serviceProducts as product, index (product.id)}
					<article
						class="flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm"
					>
						<div
							class="relative h-36 overflow-hidden bg-primary px-7 py-6 text-white"
							aria-hidden="true"
						>
							<div
								class="absolute -top-16 -right-6 size-48 rounded-full border border-secondary/45"
							></div>
							<div
								class="absolute -top-8 right-2 size-36 rounded-full border border-white/35"
							></div>
							<div
								class="absolute top-7 right-10 size-24 rounded-full border border-secondary/50"
							></div>
							<span class="relative text-xs font-semibold tracking-[.16em] text-secondary uppercase"
								>{isUkrainian ? 'Консультація' : 'Konsultacja'}</span
							>
							<span class="relative mt-5 block font-serif text-4xl text-white/90"
								>{String(index + 1).padStart(2, '0')}</span
							>
						</div>
						<div class="flex flex-1 flex-col p-6">
							<h2 class="text-xl leading-snug font-semibold">{product.name}</h2>
							{#if product.description}
								<p class="mt-3 flex-1 leading-relaxed text-slate-600">{product.description}</p>
							{:else}
								<div class="flex-1"></div>
							{/if}
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
