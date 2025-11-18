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
	import { currentLocale, Locale } from '$i18n';

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
		paginationParams.size = 3;
		paginationParams.sortBy = 'createdAt';
		paginationParams.sortOrder = 'desc';

		const fetchResult = await fetchBlogPosts(paginationParams);

		switch (fetchResult.status) {
			case 'ok':
				const posts = fetchResult.data.data;
				blogPosts = {
					...LOADED,
					data: { ...fetchResult.data, data: posts }
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

	onMount(async () => {
		isLoading = true;
		await getBlogPosts(true);
		isLoading = false;
	});
</script>

<section class="bg-white text-primary max-xl:px-4">
	<h1 class="mx-auto px-4 pt-12 pb-8 text-center text-3xl sm:text-4xl">Najnowsze wpisy z bloga</h1>
	{#if isLoading}
		<div class="mx-auto items-center justify-center px-4 pb-20">
			<LoadingSpinner size="lg" tailwind="mt-5" />
		</div>
	{:else if blogPosts.data?.data?.length === 0}
		<p class="mt-5 text-lg">{$translate('blog.noPosts')}</p>
	{:else}
		<div class="grid w-full grid-cols-3 gap-4 max-lg:flex max-lg:flex-col">
			{#each blogPosts.data?.data as post}
				<article class=" rounded-lg border border-accent p-10 pt-3 pl-3">
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
						<Button tailwind="border-none text-accent bg-white hover:bg-white hover:text-secondary"
							>Czytaj więcej</Button
						>
					</div>
				</article>
			{/each}
		</div>
		<div class="flex items-center justify-center pb-10">
			<Button tailwind="bg-white border border-accent text-primary px-6 py-3 mt-5"
				>Zobacz wszystkie wpisy</Button
			>
		</div>
	{/if}
</section>
