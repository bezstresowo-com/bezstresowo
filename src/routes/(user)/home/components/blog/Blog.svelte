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
	import { fetchBlogPosts } from './fetch-methods';
	import { translate } from '$i18n';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Button from '$lib/Button/Button.svelte';

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
		const fetchResult = await fetchBlogPosts(paginationParams);

		switch (fetchResult.status) {
			case 'ok':
				const posts = fetchResult.data.data.sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
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

<section class="bg-white text-primary">
	<h1 class="mx-auto px-4 pt-12 pb-8 text-center text-3xl sm:text-4xl">Najnowsze wpisy z bloga</h1>
	{#if isLoading}
		<LoadingSpinner size="lg" tailwind="mt-5" />
	{:else if blogPosts.data?.data.length === 0}
		<p class="mt-5 text-lg">{$translate('blog.noPosts')}</p>
	{:else}
		<div class="mx-auto flex max-w-6xl gap-5 px-4 pb-20 max-md:flex-col">
			{#each blogPosts.data?.data as post}
				<article class="h-full flex flex-1 flex-col gap-5 rounded-lg border border-accent p-10 pt-3 pl-3">
					<div class="text-accent">
						{new Date(post.createdAt).toLocaleDateString('pl-PL')}
					</div>
					<h2 class="mb-2 text-2xl font-bold">{post.title}</h2>
					<div class="prose max-w-none text-primary/70 line-clamp-3">
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
			<Button tailwind="bg-white border border-accent text-primary px-6 py-3"
				>Zobacz wszystkie wpisy</Button
			>
		</div>
	{/if}
</section>
