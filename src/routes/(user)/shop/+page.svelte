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
	const MAX_DESCRIPTION_LENGTH = 150;

	let products = $state<LoadableState<Product[]>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	let openedIndex: number | null = $state(null);

	function onOpenFullDescription(index: number) {
		openedIndex = openedIndex === index ? null : index;
	}

	function getTruncatedDescription(description: string): string {
		if (!description || description.length <= MAX_DESCRIPTION_LENGTH) return description;
		return description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
	}

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
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90"
	>
		<div class="mx-auto text-5xl text-white">{$translate(`${translarionPrefix}.title`)}</div>
		<div class="mx-auto mt-5 text-secondary">
			{$translate(`${translarionPrefix}.titleDescription`)}
		</div>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
		{#if products.isLoading && !products.data}
			<div class="col-span-full flex justify-center">
				<LoadingSpinner size="lg" tailwind="mt-10" />
			</div>
		{:else}
			{#each products.data as product, index (product.id)}
				<!-- Single product -->
				<div class="flex h-full flex-col rounded-lg border border-secondary p-4 select-none">
					<!-- Product details -->
					<div class="flex-grow border-b-1 border-black/30 pb-6">
						<img
							src={product.images[0]}
							alt={product.name}
							class="mb-4 h-48 w-full rounded-xl object-cover"
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
										? $translate(`${translarionPrefix}.showLess`)
										: $translate(`${translarionPrefix}.showMore`)}
								</Button>
							{/if}
						</div>

						{#if product.marketing_features?.length !== 0}
							<h3 class="mb-2 text-lg font-semibold">
								{$translate(`${translarionPrefix}.whatWillYouGet`)}
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
							{product.default_price?.unit_amount
								? product.default_price.unit_amount / 100 + 'zł'
								: 'N/A'}
						</p>
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
