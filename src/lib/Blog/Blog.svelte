<script lang="ts">
	import type { GetBlogArticlesPaginatedResponseDto } from '$api/admin/blog/model';
	import { PaginationParamsDto } from '$shared/global/types/http';
	import {
		type LoadableState,
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		LOADING
	} from '$shared/global/types/store';
	import { onMount } from 'svelte';

	import { translate } from '$i18n';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Button from '$lib/Button/Button.svelte';
	import { fetchBlogPosts } from '$lib/Blog/fetch-methods';
	import { currentLocale } from '$i18n';
	import { resolve } from '$app/paths';
	import type { BlogProps } from './model';
	import { Pagination } from 'bits-ui';

	const {
		title = 'user.pages.home.blog.title',
		pageSize = 3,
		isPreview = true
	}: BlogProps = $props();

	let blogPosts = $state<LoadableState<GetBlogArticlesPaginatedResponseDto>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	let paginationParams = $state(new PaginationParamsDto());
	let isLoading = $state(true);

	async function getBlogPosts(initial = false) {
		if (!initial) {
			blogPosts = {
				...blogPosts,
				...LOADING
			};
		}
		paginationParams.size = pageSize;
		paginationParams.sortBy = 'createdAt';
		paginationParams.sortOrder = 'desc';

		const fetchResult = await fetchBlogPosts(paginationParams);

		switch (fetchResult.status) {
			case 'ok': {
				const posts = fetchResult.data.data;
				blogPosts = {
					...LOADED,
					data: { ...fetchResult.data, data: posts }
				};
				break;
			}

			case 'error': {
				blogPosts = {
					...blogPosts,
					...ERRORED(fetchResult.data.message)
				};
				break;
			}

			default: {
				console.error(fetchResult);
				blogPosts = {
					...blogPosts,
					...ERRORED(fetchResult.error)
				};
				break;
			}
		}
	}

	function handlePageChange(page: number) {
		paginationParams.page = page;
		getBlogPosts();
	}

	onMount(async () => {
		isLoading = true;
		await getBlogPosts(true);
		isLoading = false;
	});
</script>

<section class="bg-white text-primary max-2xl:px-4">
	<h1 class="mx-auto px-4 pt-12 pb-8 text-center text-3xl font-semibold sm:text-4xl">
		{$translate(title)}
	</h1>
	{#if isLoading}
		<div class="mx- flex items-center justify-center px-4 pb-20">
			<LoadingSpinner size="lg" tailwind="mt-5" />
		</div>
	{:else if blogPosts.data?.data?.length === 0}
		<div class="flex flex-col items-center justify-center px-4 py-16 text-center">
			<div class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10">
				<i class="fa-solid fa-newspaper text-5xl text-secondary/60"></i>
			</div>
			<p class="text-xl font-medium text-primary/80">
				{$translate('user.pages.home.blog.noPosts')}
			</p>
		</div>
	{:else}
		<div class="grid w-full grid-cols-3 gap-4 max-lg:flex max-lg:flex-col">
			{#each blogPosts.data?.data as post (post.id)}
				<article class=" rounded-lg border border-accent p-4">
					<div class="text-accent">
						{new Date(post.createdAt).toLocaleDateString($currentLocale)}
					</div>
					<h2 class="mb-2 text-2xl font-bold">{post.title}</h2>
					<div
						class="prose prose-sm mb-4 max-h-60 max-w-none overflow-hidden text-ellipsis text-gray-600"
					>
						{@html post.content}
					</div>
					<div>
						<Button
							tailwind="border-none text-accent bg-white hover:bg-white hover:text-secondary"
							href={resolve('/(user)/blog/[id]', {
								id: post.id
							})}
						>
							{$translate('user.pages.home.blog.learnMore')}
						</Button>
					</div>
				</article>
			{/each}
		</div>

		{#if isPreview}
			<div class="flex items-center justify-center pb-10">
				<Button
					tailwind="bg-white border border-accent text-primary px-6 py-3 mt-5"
					href={resolve('/blog')}
				>
					{$translate('user.pages.home.blog.readAllPosts')}
				</Button>
			</div>
		{:else}
			<!-- Pagination -->
			<div class="mt-8 flex justify-center pb-10">
				<Pagination.Root
					count={Math.floor(blogPosts.data!.totalCount / blogPosts.data!.size)}
					perPage={paginationParams.size}
					page={paginationParams.page}
					onPageChange={(page) => handlePageChange(page)}
				>
					{#snippet children({ pages, currentPage })}
						<div class="flex items-center gap-2">
							<Pagination.PrevButton
								class="cursor-pointer rounded-md border border-accent bg-white px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
							>
								<span>
									<i class="fa-solid fa-chevron-left"></i>
								</span>
							</Pagination.PrevButton>

							{#each pages as page, i (i)}
								{#if page.type === 'ellipsis'}
									<span class="cursor-not-allowed px-2 text-accent">...</span>
								{:else}
									<Pagination.Page
										{page}
										class="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors {page.value ===
										currentPage
											? 'border-accent bg-accent text-white'
											: 'border-accent bg-white text-primary hover:bg-accent hover:text-white'}"
									>
										{page.value}
									</Pagination.Page>
								{/if}
							{/each}

							<Pagination.NextButton
								class="cursor-pointer rounded-md border border-accent bg-white px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
	{/if}
</section>
