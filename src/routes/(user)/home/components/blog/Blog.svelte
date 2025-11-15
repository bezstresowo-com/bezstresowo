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

	let blogPosts = $state<LoadableState<GetBlogArticlesPaginatedResponseDto>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	let paginationParams = $state(new PaginationParamsDto());

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
		await getBlogPosts(true);
	});
</script>

<!-- <div>{@html blogPosts.data?.data[0].content}</div>-->

<section class="mx-auto bg-white px-4 pt-12 pb-8 text-center text-primary">
	<h1 class="text-3xl font-semibold sm:text-4xl">Najnowsze wpisy z bloga</h1>
	<div>
		{#each blogPosts.data?.data as post}
			<article class="my-8 rounded-lg border border-accent p-4 text-left">
				<div>{new Date(post.createdAt)}</div>
				<h2 class="mb-2 text-2xl font-bold">{post.title}</h2>
				<div class="prose max-w-none">
					{@html post.content}
				</div>
			</article>
		{/each}
	</div>
</section>
