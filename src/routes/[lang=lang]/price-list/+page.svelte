<script lang="ts">
	import { getLocale, t } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { getProducts } from '$remote/products.remote';
	import { formatMoney } from '$shared/global/functions/format-money';

	const prefix = 'user.pages.priceList';

	// Everything on the price list comes from our own database, in the language
	// of the page - Stripe no longer holds any product or price.
	const products = $derived(getProducts({ lang: getLocale() }));
</script>

<Seo title="meta.priceList.title" description="meta.priceList.description" />

<div class="min-h-screen">
	<!-- Header Section -->
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90 p-2"
	>
		<h1 class="mx-auto text-center text-4xl font-bold text-white sm:text-5xl">
			{t(`${prefix}.title`)}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-center text-secondary">
			{t(`${prefix}.subtitle`)}
		</p>
	</div>

	<!-- Content Section -->
	<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-8 shadow-md">
			<svelte:boundary>
				{#snippet pending()}
					<div class="flex justify-center py-12">
						<LoadingSpinner />
					</div>
				{/snippet}

				{#snippet failed(error, reset)}
					<ErrorNotice {error} {reset} />
				{/snippet}

				{@const priceList = await products}

				{#if priceList.length === 0}
					<div class="py-8 text-center text-primary">
						<p>{t(`${prefix}.noProducts`)}</p>
					</div>
				{:else}
					<div class="space-y-4">
						{#each priceList as product (product.id)}
							<div
								class="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-primary/10 pb-4 last:border-b-0"
							>
								<div class="text-base text-primary sm:text-lg">
									{product.name}
								</div>
								<div class="text-base font-semibold text-primary sm:text-lg">
									{formatMoney(product.priceInMinorUnits, product.currency, getLocale())}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</svelte:boundary>
		</div>
	</div>
</div>
