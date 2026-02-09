<script lang="ts">
	import { onMount } from 'svelte';
	import { getPriceListProducts } from './fetch-methods';
	import type { PriceListProduct, PriceListProducts } from '$api/stripe/price-list/model';
	import { translate } from '$i18n';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import {
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		type LoadableState
	} from '$shared/global/types/store';

	const prefix = 'user.pages.priceList';

	let priceListProducts = $state<LoadableState<PriceListProducts>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	onMount(async () => {
		const fetchResult = await getPriceListProducts();

		switch (fetchResult.status) {
			case 'ok':
				priceListProducts = {
					...LOADED,
					data: fetchResult.data
				};
				break;

			case 'error':
				priceListProducts = {
					...priceListProducts,
					...ERRORED(fetchResult.data.message)
				};
				break;

			default:
				console.error(fetchResult);
				priceListProducts = {
					...priceListProducts,
					...ERRORED(fetchResult.error)
				};
				break;
		}
	});

	function formatPrice(price: PriceListProduct['defaultPrice']): string {
		if (!price || !price.unit_amount) return 'N/A';
		const amount = price.unit_amount / 100;
		const currency = price.currency.toUpperCase();
		return `${amount.toFixed(2)} ${currency}`;
	}
</script>

<svelte:head>
	<title>{$translate(`${prefix}.title`)} - Bezstresowo</title>
	<meta name="description" content={$translate(`${prefix}.description`)} />
</svelte:head>

<div class="min-h-screen">
	<!-- Header Section -->
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90 p-2"
	>
		<h1 class="mx-auto text-center text-4xl font-bold text-white sm:text-5xl">
			{$translate(`${prefix}.title`)}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-center text-secondary">
			{$translate(`${prefix}.subtitle`)}
		</p>
	</div>

	<!-- Content Section -->
	<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-8 shadow-md">
			{#if priceListProducts.isLoading}
				<div class="flex justify-center py-12">
					<LoadingSpinner />
				</div>
			{:else if priceListProducts.error}
				<div class="py-8 text-center text-red-600">
					<p>{priceListProducts.error}</p>
				</div>
			{:else if priceListProducts.data?.products && priceListProducts.data.products.length === 0}
				<div class="py-8 text-center text-primary">
					<p>{$translate(`${prefix}.noProducts`)}</p>
				</div>
			{:else if priceListProducts.data?.products}
				<div class="space-y-4">
					{#each priceListProducts.data.products as product, i (i)}
						<div
							class="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-primary/10 pb-4 last:border-b-0"
						>
							<div class="text-base text-primary sm:text-lg">
								{product.name}
							</div>
							<div class="text-base font-semibold text-primary sm:text-lg">
								{formatPrice(product.defaultPrice)}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
