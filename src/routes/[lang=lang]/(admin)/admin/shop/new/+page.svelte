<script lang="ts">
	import { goto } from '$app/navigation';
	import { path, t } from '$i18n';
	import AdminProductForm from '$lib/admin/shop/AdminProductForm/AdminProductForm.svelte';
	import { createProduct } from '$remote/admin-products.remote';
	import type { UpsertProductDto } from '$remote/dto/product';
	import { toast } from 'svelte-sonner';

	async function handleCreate(dto: UpsertProductDto) {
		try {
			await createProduct(dto);
			toast.success(t.admin.shop.notifications.createSuccess);
			// The list page re-queries on mount, so it picks the new product up.
			await goto(path('/admin/shop'));
			return true;
		} catch (error) {
			console.error('Failed to create product:', error);
			toast.error(t.admin.shop.notifications.createError);
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

<AdminProductForm mode="create" onSubmit={handleCreate} />
