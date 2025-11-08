<script lang="ts">
	import type { GetBlogArticlesPaginatedResponseDto } from '$api/admin/blog/model';
	import {
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		LOADING,
		type LoadableState
	} from '$shared/global/types/store';
	import { onMount } from 'svelte';
	import { fetchBlogPosts, deleteBlogPost, updateBlogPost, createBlogPost } from './model';
	import { AdminBlogForm, AdminBlogDeleteDialog } from '$lib';
	import { translate } from '$i18n';
	import { Pagination } from 'bits-ui';
	import { PaginationParamsDto } from '$shared/global/types/http';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	let blogPosts = $state<LoadableState<GetBlogArticlesPaginatedResponseDto>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	let paginationParams = $state(new PaginationParamsDto());
	let deletingPostId = $state<string | null>(null);

	async function getBlogPosts(initial = false) {
		if (!initial) {
			blogPosts = {
				...blogPosts,
				...LOADING
			};
		}

		const fetchResult = await fetchBlogPosts(paginationParams);

		switch (fetchResult.status) {
			case 'ok':
				blogPosts = {
					...LOADED,
					data: fetchResult.data
				};
				break;

			case 'error':
				blogPosts = {
					...blogPosts,
					...ERRORED(fetchResult.data.message)
				};
				break;

			default:
				console.error(fetchResult);
				blogPosts = {
					...blogPosts,
					...ERRORED(fetchResult.error)
				};
				break;
		}
	}

	async function handleBlogPostCreate(data: {
		title: string;
		content: string | null;
		media: Record<string, string> | null;
	}): Promise<boolean> {
		const mediaIds = data.media ? Object.keys(data.media) : [];
		const createResult = await createBlogPost({
			title: data.title,
			content: data.content ?? '',
			mediaIds
		});

		if (createResult.status === 'ok') {
			toast.success($translate('admin.blog.notifications.createSuccess'));
			await getBlogPosts();
			return true;
		} else {
			console.error('Failed to create blog post:', createResult);
			toast.error($translate('admin.blog.notifications.createError'));
			return false;
		}
	}

	async function handleBlogPostUpdate(
		id: string,
		data: {
			title: string;
			content: string | null;
			media: Record<string, string> | null;
		}
	): Promise<boolean> {
		const mediaIds = data.media ? Object.keys(data.media) : [];
		const updateResult = await updateBlogPost(id, {
			title: data.title,
			content: data.content ?? '',
			mediaIds
		});

		if (updateResult.status === 'ok') {
			toast.success($translate('admin.blog.notifications.updateSuccess'));
			await getBlogPosts();
			return true;
		} else {
			console.error('Failed to update blog post:', updateResult);
			toast.error($translate('admin.blog.notifications.updateError'));
			return false;
		}
	}

	async function handleDeletePost(id: string) {
		deletingPostId = id;
		const deleteResult = await deleteBlogPost(id);

		if (deleteResult.status === 'ok') {
			toast.success($translate('admin.blog.notifications.deleteSuccess'));
			await getBlogPosts();
		} else {
			console.error('Failed to delete blog post:', deleteResult);
			toast.error($translate('admin.blog.notifications.deleteError'));
		}
		deletingPostId = null;
	}

	function handlePageChange(page: number) {
		paginationParams.page = page;
		getBlogPosts();
	}

	onMount(async () => {
		await getBlogPosts(true);
	});

	const totalPages = $derived(
		blogPosts.data ? Math.ceil(blogPosts.data.data.length / paginationParams.size) : 1
	);
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={resolve('/admin')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<i class="fa-solid fa-arrow-left mr-2"></i>
		{$translate('admin.blog.back')}
	</a>
	<div class="flex-auto"></div>
	<AdminBlogForm mode="create" onSubmit={handleBlogPostCreate} />
</div>

{#if blogPosts.isLoading && !blogPosts.data}
	<!-- Loading skeleton -->
	<div class="space-y-4">
		{#each Array(3) as _, i (i)}
			<div class="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
				<div class="mb-2 h-4 w-full rounded bg-gray-100"></div>
				<div class="mb-2 h-4 w-full rounded bg-gray-100"></div>
				<div class="mb-4 h-4 w-2/3 rounded bg-gray-100"></div>
				<div class="flex justify-between">
					<div class="h-4 w-32 rounded bg-gray-200"></div>
					<div class="flex gap-2">
						<div class="h-8 w-20 rounded bg-gray-200"></div>
						<div class="h-8 w-20 rounded bg-gray-200"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else if blogPosts.error}
	<!-- Error state -->
	<div class="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
		<i class="fa-solid fa-triangle-exclamation mb-2 text-3xl text-red-500"></i>
		<p class="text-red-700">{blogPosts.error}</p>
	</div>
{:else if blogPosts.data && blogPosts.data.data.length === 0}
	<!-- Empty state -->
	<div class="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
		<i class="fa-solid fa-inbox mb-4 text-5xl text-gray-400"></i>
		<h3 class="mb-2 text-xl font-semibold text-gray-700">
			{$translate('admin.blog.emptyState.title')}
		</h3>
		<p class="text-gray-500">
			{$translate('admin.blog.emptyState.description')}
		</p>
	</div>
{:else if blogPosts.data}
	<!-- Blog posts list -->
	<div class="space-y-4">
		{#each blogPosts.data.data as post (post.id)}
			<article
				class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
			>
				<h2 class="mb-3 text-2xl font-bold text-gray-900">{post.title}</h2>

				<div class="prose prose-sm mb-4 max-h-60 max-w-none overflow-y-auto text-gray-600">
					{@html post.content}
				</div>

				<div class="flex items-center justify-between border-t border-gray-100 pt-4">
					<div class="text-sm text-gray-500">
						<i class="fa-solid fa-calendar mr-1"></i>
						{new Date(post.createdAt).toLocaleDateString()}
						{#if post.updatedAt !== post.createdAt}
							<span class="ml-2">
								<i class="fa-solid fa-pen mr-1"></i>
								{new Date(post.updatedAt).toLocaleDateString()}
							</span>
						{/if}
					</div>

					<div class="flex gap-2">
						<AdminBlogForm
							mode="update"
							initialData={{
								title: post.title,
								content: post.content,
								media: post.mediaIds.reduce((acc, id) => ({ ...acc, [id]: id }), {})
							}}
							onSubmit={(data) => handleBlogPostUpdate(post.id, data)}
						/>

						<AdminBlogDeleteDialog
							blogTitle={post.title}
							isDeleting={deletingPostId === post.id}
							onConfirm={() => handleDeletePost(post.id)}
						/>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="mt-8 flex justify-center">
			<Pagination.Root
				count={blogPosts.data.data.length}
				perPage={paginationParams.size}
				page={paginationParams.page}
				onPageChange={(page) => handlePageChange(page)}
			>
				{#snippet children({ pages, currentPage })}
					<div class="flex items-center gap-2">
						<Pagination.PrevButton
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<i class="fa-solid fa-chevron-left"></i>
						</Pagination.PrevButton>

						{#each pages as page, i (i)}
							{#if page.type === 'ellipsis'}
								<span class="px-2 text-gray-500">...</span>
							{:else}
								<Pagination.Page
									{page}
									class="rounded-md border px-3 py-2 text-sm font-medium transition-colors {page.value ===
									currentPage
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
								>
									{page.value}
								</Pagination.Page>
							{/if}
						{/each}

						<Pagination.NextButton
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<i class="fa-solid fa-chevron-right"></i>
						</Pagination.NextButton>
					</div>
				{/snippet}
			</Pagination.Root>
		</div>
	{/if}
{/if}
