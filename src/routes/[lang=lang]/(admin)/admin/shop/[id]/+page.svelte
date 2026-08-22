<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { path, t } from '$i18n';
	import AdminProductForm from '$lib/admin/shop/AdminProductForm/AdminProductForm.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import { getAdminProduct, updateProduct } from '$remote/admin-products.remote';
	import type { UpsertProductDto } from '$remote/dto/product';
	import { toast } from 'svelte-sonner';

	const productId = $derived(page.params.id as string);
	const product = $derived(getAdminProduct({ id: productId }));

	async function handleUpdate(dto: UpsertProductDto) {
		try {
			await updateProduct({ ...dto, id: productId });
			toast.success(t.admin.shop.notifications.updateSuccess);
			await goto(path('/admin/shop'));
			return true;
		} catch (error) {
			console.error('Failed to update product:', error);
			toast.error(t.admin.shop.notifications.updateError);
			return false;
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={path('/admin/shop')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<span>
			<i class="fa-solid fa-arrow-left mr-2"></i>
		</span>
		{t.admin.shop.back}
	</a>
</div>

<svelte:boundary>
	{#snippet pending()}
		<div class="h-96 animate-pulse rounded-lg border border-gray-200 bg-white shadow-sm"></div>
	{/snippet}

	{#snippet failed(error, reset)}
		<ErrorNotice {error} {reset} />
	{/snippet}

	{@const existing = await product}

	<AdminProductForm mode="update" product={existing} onSubmit={handleUpdate} />
</svelte:boundary>
