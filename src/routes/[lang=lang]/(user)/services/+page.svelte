<script lang="ts">
	import { getLocale, Locale, path, translateKey } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { CONSULTATION_SLUG, serviceCards } from '$lib/ServicesSection/catalog';
	import { createShopCheckout } from '$remote/checkout.remote';
	import { getProducts } from '$remote/products.remote';
	import { formatMoney } from '$shared/global/functions/format-money';
	import toast, { Toaster } from 'svelte-5-french-toast';

	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	const products = $derived(getProducts({ lang: getLocale() }));
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
	<section class="bg-primary px-5 py-12 text-center text-white sm:px-8 sm:py-14">
		<div class="mx-auto max-w-5xl">
			<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">Bezstresowo</p>
			<h1 class="mt-4 font-serif text-4xl sm:text-5xl">{isUkrainian ? 'Послуги' : 'Usługi'}</h1>
			<p class="mx-auto mt-5 max-w-4xl text-lg leading-relaxed text-white/85">
				{isUkrainian
					? 'Індивідуальна психотерапія, зустрічі для пар і консультації для батьків. Обери напрям, щоб дізнатися більше про роботу зі мною, переглянути вартість і записатися.'
					: 'Psychoterapia indywidualna, spotkania dla par i konsultacje dla rodziców. Wybierz obszar pracy, aby dowiedzieć się więcej, sprawdzić cenę i umówić spotkanie.'}
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
		<svelte:boundary>
			{#snippet pending()}
				<div class="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
			{/snippet}
			{#snippet failed(error, reset)}
				<ErrorNotice {error} {reset} />
				<a
					href={path('/registrations')}
					class="mt-6 inline-flex rounded-xl bg-accent px-6 py-3 font-semibold"
				>
					{isUkrainian ? 'Перейти до запису' : 'Przejdź do zapisu'}
				</a>
			{/snippet}

			{@const serviceProducts = await products}
			<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each serviceCards(serviceProducts) as card (card.key)}
					{@const service = card.service}
					{@const product = card.product}
					{@const title = service
						? translateKey(`${service.prefix}.title`)
						: (product?.name.replace(/\s*\([^)]*\)\s*$/, '') ?? '')}
					{@const description = service
						? translateKey(`${service.prefix}.description`)
						: product?.description ||
							(product?.slug === CONSULTATION_SLUG
								? isUkrainian
									? 'Зустріч, щоб обговорити те, що тебе турбує, та визначити, яка підтримка зараз потрібна.'
									: 'Spotkanie, aby porozmawiać o tym, co Cię niepokoi, i ustalić, jakiego wsparcia potrzebujesz.'
								: '')}
					{@const duration = product?.name.match(/\(([^)]+)\)/)?.[1]}
					<article
						class="flex h-full flex-col overflow-hidden rounded-2xl border border-accent/45 bg-white shadow-sm"
					>
						<a href={path(card.href)} tabindex="-1" aria-hidden="true">
							{#if card.imageUrl}
								<img
									src={card.imageUrl}
									alt=""
									class="h-36 w-full object-cover sm:h-40"
									width="640"
									height="360"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div
									class="flex h-36 items-center justify-center bg-primary text-5xl text-secondary sm:h-40"
								>
									<i class="fa-regular fa-comments" aria-hidden="true"></i>
								</div>
							{/if}
						</a>
						<div class="flex flex-1 flex-col p-5">
							<h2 class="text-xl leading-snug font-semibold">
								<a href={path(card.href)} class="hover:underline">
									{title}
								</a>
							</h2>
							<p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
								{description}
							</p>
							<a
								href={path(card.href)}
								class="mt-4 inline-flex w-fit items-center gap-2 font-semibold text-primary underline decoration-accent underline-offset-4"
							>
								{isUkrainian ? 'Дізнатися більше' : 'Dowiedz się więcej'}
								<i class="fa-solid fa-arrow-right text-sm" aria-hidden="true"></i>
							</a>
							{#if product}
								<div
									class="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-primary/10 pt-4"
								>
									<p class="text-2xl font-semibold">
										{formatMoney(product.priceInMinorUnits, product.currency, getLocale())}
									</p>
									{#if duration}<p class="text-sm text-slate-500">{duration}</p>{/if}
								</div>
							{/if}
							<a
								href={path('/registrations')}
								class="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-center font-bold text-primary hover:bg-secondary"
							>
								{isUkrainian ? 'Записатися' : 'Umów konsultację'}
							</a>
							{#if product?.siteLocations.includes('shop')}
								<button
									type="button"
									class="mt-3 min-h-11 cursor-pointer rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background disabled:cursor-wait disabled:opacity-60"
									disabled={purchaseLoadingId === product.id}
									onclick={() => payForAgreedSession(product.id)}
								>
									{purchaseLoadingId === product.id
										? '…'
										: isUkrainian
											? 'Оплатити узгоджену зустріч'
											: 'Opłać uzgodnione spotkanie'}
								</button>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		</svelte:boundary>

		<div class="mt-12 rounded-3xl border border-primary/10 bg-white p-7 text-center sm:p-9">
			<h2 class="font-serif text-2xl">
				{isUkrainian ? 'Як відбувається запис' : 'Jak wygląda zapis'}
			</h2>
			<p class="mx-auto mt-3 max-w-4xl leading-relaxed text-slate-600">
				{isUkrainian
					? 'Обери консультацію у формі, залиш контактні дані й перейди до оплати. Після її підтвердження я зв’яжуся з тобою, щоб узгодити час. Якщо ми вже домовилися про зустріч, скористайся кнопкою «Оплатити узгоджену зустріч».'
					: 'W formularzu wybierz konsultację, podaj dane kontaktowe i przejdź do płatności. Po jej potwierdzeniu skontaktuję się z Tobą, aby ustalić termin. Jeśli spotkanie jest już uzgodnione, skorzystaj z przycisku „Opłać uzgodnione spotkanie”.'}
			</p>
		</div>
	</section>
</div>
