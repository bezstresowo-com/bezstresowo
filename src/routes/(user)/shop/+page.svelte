<script lang="ts">
	import { onMount } from 'svelte';
	import { getProducts, createCheckoutSession } from './fetch-methods';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import {
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		type LoadableState
	} from '$shared/global/types/store';
	import type { ProductWithDefaultPrice } from '$api/stripe/shop-products/model';
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { asset, resolve } from '$app/paths';

	// @TODO:
	// - defaultowe zdjecie produktu w przypadku braku zdjęcia

	const translationPrefix = 'user.pages.shop';
	const MAX_DESCRIPTION_LENGTH = 150;

	let productsData = $state<LoadableState<ProductWithDefaultPrice[]>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	let openedIndex: number | null = $state(null);
	let purchaseLoadingIndex: number | null = $state(null);

	function onOpenFullDescription(index: number) {
		openedIndex = openedIndex === index ? null : index;
	}

	function getTruncatedDescription(description: string): string {
		if (!description || description.length <= MAX_DESCRIPTION_LENGTH) return description;
		return description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
	}

	async function onBuyNow(product: ProductWithDefaultPrice, index: number) {
		if (!product.defaultPrice) {
			alert($translate(`${translationPrefix}.noPriceAvailable`));
			return;
		}

		purchaseLoadingIndex = index;

		try {
			const baseUrl = window.location.origin; // Nie wiem czy powinienem to tak zostawić. SZYMON WYPOWIEDZ SIE XD

			const checkoutResult = await createCheckoutSession({
				priceId: product.defaultPrice.id,
				quantity: 1,
				successUrl: `${baseUrl}${resolve('/(user)/(payments)/(shop)/shop-success')}`,
				cancelUrl: `${baseUrl}${resolve('/(user)/(payments)/(shop)/shop-cancel')}`
			});

			switch (checkoutResult.status) {
				case 'ok': {
					// Przekieruj do Stripe Checkout po udanym stworzeniu sesji
					if (checkoutResult.data.url) {
						window.location.href = checkoutResult.data.url;
					} else {
						toast.error($translate(`${translationPrefix}.errors.checkoutError`), {
							duration: 10000
						});
					}
					break;
				}

				case 'error':
					toast.error($translate(`${translationPrefix}.errors.checkoutError`), { duration: 10000 });
					break;

				case 'validationError':
					toast.error($translate(`${translationPrefix}.errors.checkoutError`), { duration: 10000 }); // nie mam pomyslu na validation error a w sumie ten jest nawet adekwatny.
					break;

				default:
					toast.error($translate(`${translationPrefix}.errors.serverError`), { duration: 10000 });
					break;
			}
		} catch (error) {
			console.error('Purchase error:', error); // nie wiem czy chcemty to wrzucac do konsoli, moze do jakiegos pliku? Bylo by nam to w ogole potrzebne?
			toast.error($translate(`${translationPrefix}.errors.serverError`), { duration: 10000 });
		} finally {
			purchaseLoadingIndex = null;
		}
	}

	async function loadProducts() {
		const fetchResult = await getProducts();
		productsData = {
			...productsData
		};

		switch (fetchResult.status) {
			case 'ok':
				productsData = {
					...LOADED,
					data: fetchResult.data.data
				};
				break;

			case 'error':
				productsData = {
					...productsData,
					...ERRORED(fetchResult.data.message)
				};
				break;

			default:
				console.error(fetchResult);
				productsData = {
					...productsData,
					...ERRORED(fetchResult.error)
				};
				break;
		}
	}

	onMount(async () => {
		await loadProducts();
	});
</script>

<div>
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90"
	>
		<div class="mx-auto text-5xl text-white">{$translate(`${translationPrefix}.title`)}</div>
		<div class="mx-auto mt-5 text-secondary">
			{$translate(`${translationPrefix}.titleDescription`)}
		</div>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
		{#if productsData.isLoading && !productsData.data}
			<div class="col-span-full flex justify-center">
				<LoadingSpinner size="lg" tailwind="mt-10" />
			</div>
		{:else if productsData.data?.length}
			{#each productsData.data as { product, defaultPrice }, index (product.id)}
				<!-- Single product -->
				<div class="flex h-full flex-col rounded-lg border border-secondary p-4 select-none">
					<!-- Product details -->
					<div class="flex-grow border-b-1 border-black/30 pb-6">
						<img
							src={product?.images?.[0] ?? asset('/assets/shop-image-placeholder.svg')}
							alt={product.name}
							class={`mb-4 h-48 w-full rounded-xl ${product?.images?.[0] ? 'object-cover' : ''}`}
						/>
						<h2 class="mb-2 text-2xl">{product.name}</h2>

						<div class="mb-4">
							<p class="text-sm leading-relaxed">
								{#if openedIndex === index || !product.description || product.description.length <= MAX_DESCRIPTION_LENGTH}
									{product.description || ''}
								{:else}
									{getTruncatedDescription(product.description)}
								{/if}
							</p>
							{#if product.description && product.description.length > MAX_DESCRIPTION_LENGTH}
								<Button
									tailwind="text-accent bg-white hover:bg-white hover:text-secondary border-none"
									onclick={() => onOpenFullDescription(index)}
								>
									{openedIndex === index
										? $translate(`${translationPrefix}.showLess`)
										: $translate(`${translationPrefix}.showMore`)}
								</Button>
							{/if}
						</div>

						{#if product.marketing_features?.length !== 0}
							<h3 class="mb-2 text-lg font-semibold">
								{$translate(`${translationPrefix}.whatWillYouGet`)}
							</h3>
							<ul class="mt-2">
								{#each product.marketing_features as point, pointIndex (pointIndex)}
									<li class="mb-1 text-sm">
										<i class="fa-solid fa-check mr-2 text-sm text-accent"></i>{(point as any).name}
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<!-- Product Price -->
					<div class="mt-4 flex items-center justify-between">
						<p class="text-2xl text-accent">
							{defaultPrice?.unit_amount
								? defaultPrice.unit_amount / 100 + ' ' + defaultPrice.currency.toUpperCase()
								: 'N/A'}
						</p>
						<Button
							tailwind="p-4 w-auto inline-flex items-center justify-center"
							disabled={purchaseLoadingIndex === index || !defaultPrice?.unit_amount}
							onclick={() => onBuyNow({ product, defaultPrice }, index)}
							><div>
								{#if purchaseLoadingIndex === index}
									<LoadingSpinner size="sm" />
								{:else}
									<span><i class="fa-solid fa-cart-shopping mr-3"></i></span>
									{$translate(`${translationPrefix}.buyNowButton`)}
								{/if}
							</div>
						</Button>
					</div>
				</div>
			{/each}
		{:else}
			<div class="col-span-full mt-10 text-center text-lg text-slate-700">
				{#if productsData.error}
					{$translate(`${translationPrefix}.errors.loadError`)}
				{:else}
					{$translate(`${translationPrefix}.errors.noProducts`)}
				{/if}
			</div>
		{/if}
	</div>
	<Toaster />
</div>
