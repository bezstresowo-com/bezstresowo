<script lang="ts">
	import { goto } from '$app/navigation';
	import { path, t } from '$i18n';
	import AdminBlogForm from '$lib/admin/blog/AdminBlogForm/AdminBlogForm.svelte';
	import { createBlogArticle } from '$remote/admin-blog.remote';
	import type { InternationalizedBlogArticleDto } from '$remote/dto/blog';
	import { toast } from 'svelte-sonner';

	async function handleCreate(payload: {
		slug: string;
		translations: InternationalizedBlogArticleDto[];
	}) {
		try {
			await createBlogArticle(payload);
			toast.success(t.admin.blog.notifications.createSuccess);
			// The list page re-queries on mount, so it picks the new article up.
			await goto(path('/admin/blog'));
			return true;
		} catch (error) {
			console.error('Failed to create blog article:', error);
			toast.error(t.admin.blog.notifications.createError);
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

<AdminBlogForm mode="create" onSubmit={handleCreate} />
