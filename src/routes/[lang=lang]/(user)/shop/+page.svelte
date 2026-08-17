<script lang="ts">
	import { asset } from '$app/paths';
	import { getLocale, t } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { productListJsonLd } from '$lib/Seo/model';
	import { createShopCheckout } from '$remote/checkout.remote';
	import type { LocalizedProduct } from '$remote/dto/product';
	import { getProducts } from '$remote/products.remote';
	import { formatMoney } from '$shared/global/functions/format-money';
	import toast, { Toaster } from 'svelte-5-french-toast';

	const MAX_DESCRIPTION_LENGTH = 150;

	const products = $derived(getProducts({ lang: getLocale(), siteLocation: 'shop' }));

	let openedId: string | null = $state(null);
	let purchaseLoadingId: string | null = $state(null);

	function getTruncatedDescription(description: string): string {
		if (!description || description.length <= MAX_DESCRIPTION_LENGTH) return description;
		return `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
	}

	async function onBuyNow(product: LocalizedProduct) {
		purchaseLoadingId = product.id;

		try {
			// The checkout is built server side from our own product row.
			const session = await createShopCheckout({
				productId: product.id,
				lang: getLocale(),
				quantity: 1
			});

			if (session.url) {
				window.location.href = session.url;
			} else {
				toast.error(t.user.pages.shop.errors.checkoutError, { duration: 10000 });
			}
		} catch (error) {
			console.error('Purchase error:', error);
			toast.error(t.user.pages.shop.errors.serverError, { duration: 10000 });
		} finally {
			purchaseLoadingId = null;
		}
	}
</script>

<Toaster />

<div>
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90 p-2"
	>
		<h1 class="mx-auto text-4xl font-bold text-white sm:text-5xl">
			{t.user.pages.shop.title}
		</h1>
		<div class="mx-auto mt-5 text-secondary">
			{t.user.pages.shop.titleDescription}
		</div>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
		<svelte:boundary>
			{#snippet pending()}
				<div class="col-span-full flex justify-center">
					<LoadingSpinner size="lg" tailwind="mt-10" />
				</div>
			{/snippet}

			{#snippet failed(error, reset)}
				<Seo title={t.meta.shop.title} description={t.meta.shop.description} />
				<div class="col-span-full">
					<ErrorNotice {error} {reset} />
				</div>
			{/snippet}

			{@const shopProducts = await products}

			<!-- Inside the boundary so the product `ItemList` makes it into the SSR head. -->
			<Seo
				title={t.meta.shop.title}
				description={t.meta.shop.description}
				jsonLd={productListJsonLd(shopProducts.map((product) => product.metadataJsonLD))}
			/>

			{#if shopProducts.length === 0}
				<div class="col-span-full mt-10 text-center text-lg text-slate-700">
					{t.user.pages.shop.errors.noProducts}
				</div>
			{:else}
				{#each shopProducts as product (product.id)}
					<!-- Single product -->
					<div class="flex h-full flex-col rounded-lg border border-secondary p-4 select-none">
						<!-- Product details -->
						<div class="flex-grow border-b-1 border-black/30 pb-6">
							<img
								src={product.imageUrls[0] ?? asset('/assets/shop-image-placeholder.svg')}
								alt={product.name}
								class={`mb-4 h-48 w-full rounded-xl ${product.imageUrls[0] ? 'object-cover' : ''}`}
								loading="lazy"
							/>
							<h2 class="mb-2 text-2xl">{product.name}</h2>

							<div class="mb-4">
								<p class="text-sm leading-relaxed">
									{#if openedId === product.id || product.description.length <= MAX_DESCRIPTION_LENGTH}
										{product.description}
									{:else}
										{getTruncatedDescription(product.description)}
									{/if}
								</p>
								{#if product.description.length > MAX_DESCRIPTION_LENGTH}
									<Button
										tailwind="text-accent bg-white hover:bg-white hover:text-secondary border-none"
										onclick={() => {
											openedId = openedId === product.id ? null : product.id;
										}}
									>
										{openedId === product.id
											? t.user.pages.shop.showLess
											: t.user.pages.shop.showMore}
									</Button>
								{/if}
							</div>
						</div>

						<!-- Product Price -->
						<div class="mt-4 flex items-center justify-between">
							<p class="text-2xl text-accent">
								{formatMoney(product.priceInMinorUnits, product.currency, getLocale())}
							</p>
							<Button
								tailwind="p-4 w-auto inline-flex items-center justify-center"
								disabled={purchaseLoadingId === product.id}
								onclick={() => onBuyNow(product)}
							>
								<div>
									{#if purchaseLoadingId === product.id}
										<LoadingSpinner size="sm" />
									{:else}
										<span><i class="fa-solid fa-cart-shopping mr-3"></i></span>
										{t.user.pages.shop.buyNowButton}
									{/if}
								</div>
							</Button>
						</div>
					</div>
				{/each}
			{/if}
		</svelte:boundary>
	</div>
</div>
