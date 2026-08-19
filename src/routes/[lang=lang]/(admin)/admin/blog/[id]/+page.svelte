<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { path, t } from '$i18n';
	import AdminBlogForm from '$lib/admin/blog/AdminBlogForm/AdminBlogForm.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import { getAdminBlogArticle, updateBlogArticle } from '$remote/admin-blog.remote';
	import type { InternationalizedBlogArticleDto } from '$remote/dto/blog';
	import { toast } from 'svelte-sonner';

	const articleId = $derived(page.params.id as string);
	const article = $derived(getAdminBlogArticle({ id: articleId }));

	async function handleUpdate(payload: {
		slug: string;
		translations: InternationalizedBlogArticleDto[];
	}) {
		try {
			await updateBlogArticle({ id: articleId, ...payload });
			toast.success(t.admin.blog.notifications.updateSuccess);
			await goto(path('/admin/blog'));
			return true;
		} catch (error) {
			console.error('Failed to update blog article:', error);
			toast.error(t.admin.blog.notifications.updateError);
			return false;
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={path('/admin/blog')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<span>
			<i class="fa-solid fa-arrow-left mr-2"></i>
		</span>
		{t.admin.blog.back}
	</a>
</div>

<svelte:boundary>
	{#snippet pending()}
		<div class="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 h-6 w-1/2 rounded bg-gray-200"></div>
			<div class="mb-2 h-4 w-full rounded bg-gray-100"></div>
			<div class="h-64 w-full rounded bg-gray-100"></div>
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<ErrorNotice {error} {reset} />
	{/snippet}

	{@const existing = await article}

	<AdminBlogForm mode="update" article={existing} onSubmit={handleUpdate} />
</svelte:boundary>
