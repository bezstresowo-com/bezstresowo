<script lang="ts">
	import { getLocale, Locale, path } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';
	import { CONSULTATION_SLUG } from '$lib/ServicesSection/catalog';
	import { createShopCheckout } from '$remote/checkout.remote';
	import { formatMoney } from '$shared/global/functions/format-money';
	import toast, { Toaster } from 'svelte-5-french-toast';
	let { data } = $props();
	const product = $derived(data.product);
	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	const title = $derived(product.name.replace(/\s*\([^)]*\)\s*$/, ''));
	const description = $derived(
		product.description ||
			(product.slug === CONSULTATION_SLUG
				? isUkrainian
					? 'Психотерапевтична консультація онлайн та в Лодзі. Зустріч, щоб обговорити те, що тебе турбує, та визначити, яка підтримка зараз потрібна.'
					: 'Konsultacja psychoterapeutyczna online i w Łodzi. Spotkanie, aby porozmawiać o tym, co Cię niepokoi, i ustalić, jakiego wsparcia potrzebujesz.'
				: title)
	);
	let loading = $state(false);
	async function pay() {
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
				isUkrainian ? 'Не вдалося відкрити оплату.' : 'Nie udało się otworzyć płatności.'
			);
		} finally {
			loading = false;
		}
	}
</script>

<Seo
	title={`${title} | Bezstresowo`}
	description={description.replace(/\s+/g, ' ').slice(0, 180)}
/>
<Toaster />
<section class="bg-primary px-5 py-9 text-center text-white sm:py-12">
	<a href={path('/services')} class="text-sm font-semibold text-secondary"
		>← {isUkrainian ? 'Усі послуги' : 'Wszystkie usługi'}</a
	>
	<h1 class="mx-auto mt-4 max-w-4xl text-3xl font-bold sm:text-4xl">{title}</h1>
</section>
<main class="bg-background/40 px-5 py-10 sm:py-14">
	<div class="mx-auto max-w-3xl rounded-2xl border border-accent/40 bg-white p-6 sm:p-9">
		{#if product.imageUrl}<img
				src={product.imageUrl}
				alt=""
				class="mb-6 max-h-64 w-full rounded-xl object-cover"
			/>{/if}
		<p class="text-lg leading-relaxed whitespace-pre-line text-slate-600">{description}</p>
		<p class="mt-6 text-2xl font-semibold text-primary">
			{formatMoney(product.priceInMinorUnits, product.currency, getLocale())}
		</p>
		<p class="mt-3 text-sm leading-relaxed text-slate-600">
			{isUkrainian
				? 'Під час першої зустрічі ми обговоримо твій запит і можливі наступні кроки. Зустріч відбувається конфіденційно.'
				: 'Na pierwszym spotkaniu porozmawiamy o tym, z czym przychodzisz, i możliwych kolejnych krokach. Spotkanie jest poufne.'}
		</p>
		<div class="mt-6 flex flex-col gap-3 sm:flex-row">
			<a
				href={path('/registrations')}
				class="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-6 py-3 font-semibold text-primary hover:bg-secondary"
				>{isUkrainian ? 'Записатися' : 'Umów konsultację'}</a
			>
			{#if product.siteLocations.includes('shop')}<button
					type="button"
					onclick={pay}
					disabled={loading}
					class="min-h-11 cursor-pointer rounded-xl border border-primary/25 px-6 py-3 text-sm font-semibold text-primary hover:bg-background disabled:opacity-60"
					>{loading
						? '…'
						: isUkrainian
							? 'Оплатити узгоджену зустріч'
							: 'Opłać uzgodnione spotkanie'}</button
				>{/if}
		</div>
	</div>
</main>
