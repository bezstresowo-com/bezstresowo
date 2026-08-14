<script lang="ts">
	import { resolve } from '$app/paths';
	import { DEFAULT_LOCALE, Locale, t } from '$i18n';
	import { AdminDeleteDialog } from '$lib';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import { LOCALE_TAB_LABELS } from '$lib/admin/blog/AdminBlogForm/model';
	import AdminProductForm from '$lib/admin/shop/AdminProductForm/AdminProductForm.svelte';
	import {
		createProduct,
		deleteProduct,
		getAdminProducts,
		updateProduct
	} from '$remote/admin-products.remote';
	import type { UpsertProductDto } from '$remote/dto/product';
	import { formatMoney } from '$shared/global/functions/format-money';
	import { toast } from 'svelte-sonner';

	let deletingProductId = $state<string | null>(null);

	const products = $derived(getAdminProducts());

	async function handleCreate(dto: UpsertProductDto) {
		try {
			await createProduct(dto).updates(getAdminProducts());
			toast.success(t('admin.shop.notifications.createSuccess'));
			return true;
		} catch (error) {
			console.error('Failed to create product:', error);
			toast.error(t('admin.shop.notifications.createError'));
			return false;
		}
	}

	async function handleUpdate(id: string, dto: UpsertProductDto) {
		try {
			await updateProduct({ ...dto, id }).updates(getAdminProducts());
			toast.success(t('admin.shop.notifications.updateSuccess'));
			return true;
		} catch (error) {
			console.error('Failed to update product:', error);
			toast.error(t('admin.shop.notifications.updateError'));
			return false;
		}
	}

	async function handleDelete(id: string) {
		deletingProductId = id;

		try {
			// Optimistic: the row disappears before the server answers.
			await deleteProduct({ id }).updates(
				getAdminProducts().withOverride((current) => current.filter((product) => product.id !== id))
			);
			toast.success(t('admin.shop.notifications.deleteSuccess'));
		} catch (error) {
			console.error('Failed to delete product:', error);
			toast.error(t('admin.shop.notifications.deleteError'));
		} finally {
			deletingProductId = null;
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={resolve('/(admin)/admin')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<span>
			<i class="fa-solid fa-arrow-left mr-2"></i>
		</span>
		{t('admin.shop.back')}
	</a>
	<div class="flex-auto"></div>
	<AdminProductForm mode="create" onSubmit={handleCreate} />
</div>

<svelte:boundary>
	{#snippet pending()}
		<div class="space-y-4">
			{#each Array(3) as _, i (i)}
				<div class="h-28 animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm"></div>
			{/each}
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<ErrorNotice {error} {reset} />
	{/snippet}

	{@const productList = await products}

	{#if productList.length === 0}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
			<span>
				<i class="fa-solid fa-inbox mb-4 text-5xl text-gray-400"></i>
			</span>
			<h3 class="mb-2 text-xl font-semibold text-gray-700">
				{t('admin.shop.emptyState.title')}
			</h3>
			<p class="text-gray-500">{t('admin.shop.emptyState.description')}</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each productList as product (product.id)}
				{@const primary =
					product.internationalizedProducts.find(
						(translation) => translation.lang === DEFAULT_LOCALE
					) ?? product.internationalizedProducts[0]}
				<article class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<div class="mb-3 flex flex-wrap items-center gap-2">
						{#each product.internationalizedProducts as translation (translation.id)}
							<span class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
								{t(LOCALE_TAB_LABELS[translation.lang as Locale] ?? translation.lang)}
							</span>
						{/each}

						{#each product.siteLocations as location (location)}
							<span class="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
								{location === 'shop'
									? t('user.header.items.shop')
									: t('user.header.items.registrations')}
							</span>
						{/each}

						{#if !product.active}
							<span class="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
								<i class="fa-solid fa-eye-slash mr-1"></i>
							</span>
						{/if}
					</div>

					<h2 class="mb-1 text-2xl font-bold text-gray-900">{primary?.name ?? product.slug}</h2>
					<code class="text-sm text-gray-500">/{product.slug}</code>

					<div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
						<div class="text-lg font-semibold text-gray-800">
							{formatMoney(product.price.inMinorUnits, product.price.currency, DEFAULT_LOCALE)}
						</div>

						<div class="flex gap-2">
							<AdminProductForm
								mode="update"
								{product}
								onSubmit={(dto) => handleUpdate(product.id, dto)}
							/>

							<AdminDeleteDialog
								itemName={primary?.name ?? product.slug}
								translationPrefix="admin.shop.deleteDialog"
								actionsPrefix="admin.shop.actions"
								isDeleting={deletingProductId === product.id}
								onConfirm={() => handleDelete(product.id)}
							/>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</svelte:boundary>
