<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fetchBlogPost } from '../fetch-methods';
	import {
		DEFAULT_LOADABLE_STATE,
		LOADING,
		LOADED,
		ERRORED,
		type LoadableState
	} from '$shared/global/types/store';
	import type { BlogArticle } from '@prisma/client';
	import Button from '$lib/Button/Button.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { translate, currentLocale } from '$i18n';
	import { resolve } from '$app/paths';

	let blogPost = $state<LoadableState<BlogArticle>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	onMount(async () => {
		const id = $page.params.id!;
		blogPost = { ...blogPost, ...LOADING };

		const result = await fetchBlogPost(id);

		switch (result.status) {
			case 'ok': {
				blogPost = { ...LOADED, data: result.data };
				break;
			}

			case 'error': {
				blogPost = { ...blogPost, ...ERRORED(result.data.message) };
				break;
			}

			case 'validationError': {
				blogPost = { ...blogPost, ...ERRORED(result.data.errors[0].messages[0]) };
				break;
			}

			case 'unknown': {
				blogPost = { ...blogPost, ...ERRORED(result.error) };
				break;
			}
		}
	});
</script>

<section class="mx-auto max-w-4xl px-4 py-8 sm:py-12">
	<div class="mb-8">
		<Button
			href={resolve('/blog')}
			tailwind="bg-white border border-accent text-primary px-6 py-3 mt-5"
		>
			<i class="fa-solid fa-arrow-left mr-2"></i>
			{$translate('admin.blog.back')}
		</Button>
	</div>

	{#if blogPost.isLoading}
		<div class="flex justify-center py-20">
			<LoadingSpinner size="lg" />
		</div>
	{:else if blogPost.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
			<p>{blogPost.error}</p>
			<Button
				href={resolve('/blog')}
				tailwind="mt-4 bg-red-100 text-red-700 hover:bg-red-200 border-none"
			>
				{$translate('admin.blog.back')}
			</Button>
		</div>
	{:else if blogPost.data}
		<article class="rounded-lg bg-white p-4 shadow-sm sm:p-8">
			<header class="mb-8 border-b border-gray-100 pb-8">
				<div class="mb-4 text-sm text-accent">
					{new Date(blogPost.data.createdAt).toLocaleDateString($currentLocale, {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</div>
				<h1 class="text-3xl font-bold text-primary sm:text-4xl">
					{blogPost.data.title}
				</h1>
			</header>

			<div class="prose sm:prose-lg max-w-none text-gray-600">
				{@html blogPost.data.content}
			</div>
		</article>
	{/if}
</section>
