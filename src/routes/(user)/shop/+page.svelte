<script lang="ts">
	import { onMount } from 'svelte';
	import { getProducts } from './fetch-methods';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import {
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		type LoadableState
	} from '$shared/global/types/store';
	import type { Product } from '$api/stripe-webhook/model';
	import { translate } from '$i18n';

	let products = $state<LoadableState<Product[]>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	async function loadProducts() {
		const fetchResult = await getProducts();
		products = {
			...products
		};

		switch (fetchResult.status) {
			case 'ok':
				products = {
					...LOADED,
					data: fetchResult.data.products
				};
				break;

			case 'error':
				products = {
					...products,
					...ERRORED(fetchResult.data.message)
				};
				break;

			default:
				console.error(fetchResult);
				products = {
					...products,
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
	x
	<div
		class="flex h-50 flex-col items-center justify-center bg-primary bg-linear-170 from-primary to-white to-1000%"
	>
		<div class="mx-auto">{$translate('shop.title')}</div>
		<div class="mx-auto">{$translate('shop.titleDescription')}</div>
	</div>

	<div class="flex flex-wrap">
		{#if products.isLoading && !products.data}
			<LoadingSpinner size="lg" />
		{:else}
			{#each products.data as product (product.id)}
				<div class="w- m-2 rounded-lg border p-4">
					<img src={product.images[0]} alt={product.name} class="mb-4 h-40 w-40 object-cover" />
					<h2>{product.name}</h2>
					<p>Opis: {product.description}</p>
					<p>
						Cena: {product.default_price?.unit_amount
							? product.default_price.unit_amount / 100 + 'PLN'
							: 'N/A'}
					</p>
				</div>
			{/each}
		{/if}
	</div>
</div>
