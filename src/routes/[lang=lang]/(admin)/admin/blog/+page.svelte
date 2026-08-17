<script lang="ts">
	import { path, t } from '$i18n';
	import AdminDeleteDialog from '$lib/admin/AdminDeleteDialog/AdminDeleteDialog.svelte';
	import AdminBlogForm from '$lib/admin/blog/AdminBlogForm/AdminBlogForm.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import { localeTabLabel } from '$lib/admin/blog/AdminBlogForm/model';
	import {
		createBlogArticle,
		deleteBlogArticle,
		getAdminBlogArticles,
		updateBlogArticle
	} from '$remote/admin-blog.remote';
	import type { InternationalizedBlogArticleDto } from '$remote/dto/blog';
	import { Pagination } from 'bits-ui';
	import { toast } from 'svelte-sonner';

	const PAGE_SIZE = 25;

	let currentPage = $state(1);
	let deletingArticleId = $state<string | null>(null);

	const listParams = $derived({
		page: currentPage,
		size: PAGE_SIZE,
		sortBy: 'createdAt' as const,
		sortOrder: 'desc' as const
	});
	const articles = $derived(getAdminBlogArticles(listParams));

	async function handleCreate(translations: InternationalizedBlogArticleDto[]) {
		try {
			// Single flight: the mutation response carries the refreshed list.
			await createBlogArticle({ translations }).updates(getAdminBlogArticles(listParams));
			toast.success(t.admin.blog.notifications.createSuccess);
			return true;
		} catch (error) {
			console.error('Failed to create blog article:', error);
			toast.error(t.admin.blog.notifications.createError);
			return false;
		}
	}

	async function handleUpdate(id: string, translations: InternationalizedBlogArticleDto[]) {
		try {
			await updateBlogArticle({ id, translations }).updates(getAdminBlogArticles(listParams));
			toast.success(t.admin.blog.notifications.updateSuccess);
			return true;
		} catch (error) {
			console.error('Failed to update blog article:', error);
			toast.error(t.admin.blog.notifications.updateError);
			return false;
		}
	}

	async function handleDelete(id: string) {
		deletingArticleId = id;

		try {
			// Optimistic: the row disappears before the server answers.
			await deleteBlogArticle({ id }).updates(
				getAdminBlogArticles(listParams).withOverride((current) => ({
					...current,
					data: current.data.filter((article) => article.id !== id),
					totalCount: Math.max(0, current.totalCount - 1)
				}))
			);
			toast.success(t.admin.blog.notifications.deleteSuccess);
		} catch (error) {
			console.error('Failed to delete blog article:', error);
			toast.error(t.admin.blog.notifications.deleteError);
		} finally {
			deletingArticleId = null;
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={path('/admin')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<span>
			<i class="fa-solid fa-arrow-left mr-2"></i>
		</span>
		{t.admin.blog.back}
	</a>
	<div class="flex-auto"></div>
	<AdminBlogForm mode="create" onSubmit={handleCreate} />
</div>

<svelte:boundary>
	{#snippet pending()}
		<!-- Loading skeleton -->
		<div class="space-y-4">
			{#each Array(3) as _, i (i)}
				<div class="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
					<div class="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
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
	{/snippet}

	{#snippet failed(error, reset)}
		<ErrorNotice {error} {reset} />
	{/snippet}

	{@const result = await articles}

	{#if result.data.length === 0}
		<!-- Empty state -->
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
			<span>
				<i class="fa-solid fa-inbox mb-4 text-5xl text-gray-400"></i>
			</span>
			<h3 class="mb-2 text-xl font-semibold text-gray-700">
				{t.admin.blog.emptyState.title}
			</h3>
			<p class="text-gray-500">
				{t.admin.blog.emptyState.description}
			</p>
		</div>
	{:else}
		<!-- Blog articles list -->
		<div class="space-y-4">
			{#each result.data as article (article.id)}
				{@const primary = article.internationalizedArticles[0]}
				<article
					class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
				>
					<div class="mb-3 flex items-center gap-2">
						{#each article.internationalizedArticles as translation (translation.id)}
							<span class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
								{localeTabLabel(translation.lang)}
							</span>
						{/each}
					</div>

					<h2 class="mb-3 text-2xl font-bold text-gray-900">{primary?.title ?? ''}</h2>

					<ul class="mb-4 space-y-1 text-sm text-gray-600">
						{#each article.internationalizedArticles as translation (translation.id)}
							<li>
								<code class="rounded bg-gray-50 px-1"
									>/{translation.lang.slice(0, 2)}/blog/{translation.slug}</code
								>
								- {translation.metaTitle}
							</li>
						{/each}
					</ul>

					<div class="flex items-center justify-between border-t border-gray-100 pt-4">
						<div class="text-sm text-gray-500">
							<span>
								<i class="fa-solid fa-calendar mr-1"></i>
							</span>
							{new Date(article.createdAt).toLocaleDateString()}
							{#if article.updatedAt !== article.createdAt}
								<span class="ml-2">
									<span>
										<i class="fa-solid fa-pen mr-1"></i>
									</span>
									{new Date(article.updatedAt).toLocaleDateString()}
								</span>
							{/if}
						</div>

						<div class="flex gap-2">
							<AdminBlogForm
								mode="update"
								initialTranslations={article.internationalizedArticles}
								onSubmit={(translations) => handleUpdate(article.id, translations)}
							/>

							<AdminDeleteDialog
								itemName={primary?.title ?? ''}
								labels={t.admin.blog.deleteDialog}
								triggerLabel={t.admin.blog.actions.delete}
								isDeleting={deletingArticleId === article.id}
								onConfirm={() => handleDelete(article.id)}
							/>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- Pagination -->
		<div class="mt-8 flex justify-center">
			<Pagination.Root
				count={result.totalCount}
				perPage={result.size}
				page={currentPage}
				onPageChange={(value) => (currentPage = value)}
			>
				{#snippet children({ pages, currentPage: activePage })}
					<div class="flex items-center gap-2">
						<Pagination.PrevButton
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<span>
								<i class="fa-solid fa-chevron-left"></i>
							</span>
						</Pagination.PrevButton>

						{#each pages as pageItem, i (i)}
							{#if pageItem.type === 'ellipsis'}
								<span class="px-2 text-gray-500">...</span>
							{:else}
								<Pagination.Page
									page={pageItem}
									class="rounded-md border px-3 py-2 text-sm font-medium transition-colors {pageItem.value ===
									activePage
										? 'border-blue-500 bg-blue-500 text-white'
										: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
								>
									{pageItem.value}
								</Pagination.Page>
							{/if}
						{/each}

						<Pagination.NextButton
							class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<span>
								<i class="fa-solid fa-chevron-right"></i>
							</span>
						</Pagination.NextButton>
					</div>
				{/snippet}
			</Pagination.Root>
		</div>
	{/if}
</svelte:boundary>
