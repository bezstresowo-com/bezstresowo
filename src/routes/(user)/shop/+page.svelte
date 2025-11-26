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
	import Button from '$lib/Button/Button.svelte';

	const translarionPrefix = 'user.pages.shop';
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
	<div
		class="flex h-50 flex-col items-center justify-center bg-primary bg-linear-170 from-primary to-white to-1000%"
	>
		<div class="mx-auto text-5xl text-white">{$translate(`${translarionPrefix}.title`)}</div>
		<div class="mx-auto mt-5 text-secondary">
			{$translate(`${translarionPrefix}.titleDescription`)}
		</div>
	</div>

	<div class="flex flex-wrap justify-center">
		{#if products.isLoading && !products.data}
			<LoadingSpinner size="lg" tailwind="mt-10" />
		{:else}
			{#each products.data as product (product.id)}
				<!-- Single product -->
				<div class="m-2 w-xl rounded-lg border border-secondary p-4">
					<!-- Product details -->
					<div class="border-b-1 border-black/30 pb-6">
						<img
							src={product.images[0]}
							alt={product.name}
							class="image-contain mb-4 aspect-video w-xl rounded-xl"
						/>
						<h2 class="text-2xl">{product.name}</h2>
						<p class="mt-4">{product.description}</p>
						{#if product.metadata?.whatYouGet}
							<ul class="mt-4">
								{#each product.metadata.whatYouGet.split(',') as point, index (index)}
									<li><i class="fa-solid fa-check text-xl text-accent"></i>{point}</li>
								{/each}
							</ul>
						{/if}
					</div>
					<!-- Product Price -->
					<div class="mt-4 flex items-center justify-between">
						<p class="text-accent text-2xl">{product.default_price?.unit_amount
							? product.default_price.unit_amount / 100 + 'zł'
							: 'N/A'}</p>
						<Button tailwind="p-4 w-auto inline-flex items-center justify-center"
							><i class="fa-solid fa-cart-shopping mr-3"></i>{$translate(
								`${translarionPrefix}.buyNowButton`
							)}</Button
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
