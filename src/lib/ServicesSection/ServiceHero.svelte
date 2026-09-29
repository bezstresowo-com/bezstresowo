<script lang="ts">
	import { getLocale, Locale, path } from '$i18n';
	import type { LocalizedProduct } from '$remote/dto/product';
	import { createShopCheckout } from '$remote/checkout.remote';
	import { formatMoney } from '$shared/global/functions/format-money';
	import { CONSULTATION_SLUG, CONSULTATION_IMAGE_URL } from './catalog';
	import toast, { Toaster } from 'svelte-5-french-toast';
	let {
		title,
		description,
		imageUrl,
		product,
		couples = false
	}: {
		title: string;
		description: string;
		imageUrl: string | null;
		product?: Pick<
			LocalizedProduct,
			'id' | 'slug' | 'priceInMinorUnits' | 'currency' | 'siteLocations'
		> | null;
		couples?: boolean;
	} = $props();
	const uk = $derived(getLocale() === Locale.ukUA);
	const consultation = $derived(product?.slug === CONSULTATION_SLUG);
	const picture = $derived(imageUrl || (consultation ? CONSULTATION_IMAGE_URL : null));
	const canPay = $derived(product && (consultation || product.siteLocations.includes('shop')));
	let loading = $state(false);
	async function pay() {
		if (!product || loading) return;
		loading = true;
		try {
			const session = await createShopCheckout({
				productId: product.id,
				lang: getLocale(),
				quantity: 1
			});
			if (!session.url) throw new Error('Missing checkout URL');
			window.location.href = session.url;
		} catch {
			toast.error(
				uk
					? 'Не вдалося відкрити оплату. Спробуй ще раз.'
					: 'Nie udało się otworzyć płatności. Spróbuj ponownie.'
			);
		} finally {
			loading = false;
		}
	}
</script>

<Toaster />
<section class="service-hero bg-background text-primary">
	<div class="mx-auto grid max-w-7xl lg:grid-cols-2">
		{#if picture}
			<div class="relative h-64 sm:h-96 lg:h-auto lg:min-h-[32rem]">
				<img
					src={picture}
					alt=""
					width="720"
					height="600"
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		{/if}
		<div class="px-5 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
			<a href={path('/services')} class="text-sm text-primary/70 underline underline-offset-4"
				>{uk ? 'Послуги' : 'Usługi'}</a
			>
			<h1 class="mt-6 font-serif text-3xl leading-tight font-normal sm:text-4xl lg:text-5xl">
				{title}
			</h1>
			<div class="mt-5 h-0.5 w-16 bg-accent"></div>
			<p class="mt-5 text-lg leading-relaxed text-primary/85">{description}</p>
			<div class="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-base">
				<p>
					<i class="fa-regular fa-clock mr-2 text-accent" aria-hidden="true"></i>{couples
						? uk
							? '75 хвилин'
							: '75 minut'
						: uk
							? '50 хвилин'
							: '50 minut'}{#if product}
						· {formatMoney(product.priceInMinorUnits, product.currency, getLocale())}{/if}
				</p>
				<p>
					<i class="fa-solid fa-location-dot mr-2 text-accent" aria-hidden="true"></i>{uk
						? 'Онлайн або очно в Лодзі'
						: 'Online lub stacjonarnie w Łodzi'}
				</p>
			</div>
			<div class="mt-8 flex flex-col gap-3 xl:flex-row">
				<a
					href={path('/registrations')}
					class="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white transition hover:bg-primary/90"
					>{uk ? 'Записатися на консультацію' : 'Umów konsultację'}</a
				>
				{#if canPay}<button
						type="button"
						onclick={pay}
						disabled={loading}
						class="min-h-12 cursor-pointer rounded-xl border border-primary px-5 py-3 font-semibold transition hover:bg-white/60 disabled:opacity-60"
						>{loading
							? '…'
							: uk
								? 'Оплатити узгоджену зустріч'
								: 'Opłać uzgodnione spotkanie'}</button
					>{/if}
			</div>
			{#if canPay}<p class="mt-3 text-sm leading-relaxed text-primary/65">
					{uk
						? 'Оплата після погодження дати й часу зустрічі.'
						: 'Płatność po uzgodnieniu daty i godziny spotkania.'}
				</p>{/if}
		</div>
	</div>
</section>

<style>
	.service-hero {
		box-shadow: 0 0 0 100vmax var(--color-background);
		clip-path: inset(0 -100vmax);
	}
</style>
