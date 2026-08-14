<script lang="ts">
	import { getLocale, path, t } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { getBlogArticles } from '$remote/blog.remote';
	import { Pagination } from 'bits-ui';

	import type { BlogProps } from './model';

	const {
		title = 'user.pages.home.blog.title',
		siteLocation = 'standalone',
		pageSize = 3,
		isPreview = true
	}: BlogProps = $props();

	let currentPage = $state(1);

	const articles = $derived(
		getBlogArticles({ lang: getLocale(), page: currentPage, size: pageSize })
	);
</script>

<section class="bg-white text-primary">
	{#if siteLocation === 'standalone'}
		<div
			class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90 p-2"
		>
			<h1 class="mx-auto text-center text-4xl font-bold text-white sm:text-5xl">
				{t(title)}
			</h1>
		</div>
	{:else if siteLocation === 'home'}
		<div class="mt-16 pb-8 text-center">
			<h2 class="text-3xl font-semibold text-primary sm:text-4xl">
				{t(title)}
			</h2>
		</div>
	{/if}

	<svelte:boundary>
		{#snippet pending()}
			<div class="flex items-center justify-center px-4 pb-20">
				<LoadingSpinner size="lg" tailwind="mt-5" />
			</div>
		{/snippet}

		{#snippet failed(error, reset)}
			<div class="px-4 pb-20">
				<ErrorNotice {error} {reset} />
			</div>
		{/snippet}

		{@const result = await articles}

		{#if result.data.length === 0}
			<div class="flex flex-col items-center justify-center px-4 py-16 text-center">
				<div class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10">
					<i class="fa-solid fa-newspaper text-5xl text-secondary/60"></i>
				</div>
				<p class="text-xl font-medium text-primary/80">
					{t('user.pages.home.blog.noPosts')}
				</p>
			</div>
		{:else}
			<div class="grid w-full grid-cols-3 gap-4 pt-4 max-2xl:px-4 max-lg:flex max-lg:flex-col">
				{#each result.data as post (post.slug)}
					<article class="rounded-lg border border-accent p-4">
						<div class="text-accent">
							{new Date(post.createdAt).toLocaleDateString(getLocale())}
						</div>
						<h3 class="mb-2 text-2xl font-bold">{post.title}</h3>
						<p class="mb-4 max-h-60 overflow-hidden text-ellipsis text-gray-600">
							{post.metaDescription}
						</p>
						<div>
							<Button
								tailwind="border-none text-accent bg-white hover:bg-white hover:text-secondary"
								href={path(`/blog/${post.slug}`)}
							>
								{t('user.pages.home.blog.learnMore')}
							</Button>
						</div>
					</article>
				{/each}
			</div>

			{#if isPreview}
				<div class="flex items-center justify-center pb-10">
					<Button
						tailwind="bg-white border border-accent text-primary px-6 py-3 mt-5"
						href={path('/blog')}
					>
						{t('user.pages.home.blog.readAllPosts')}
					</Button>
				</div>
			{:else}
				<!-- Pagination -->
				<div class="mt-8 flex justify-center pb-10">
					<Pagination.Root
						count={result.totalCount}
						perPage={result.size}
						page={currentPage}
						onPageChange={(value) => (currentPage = value)}
					>
						{#snippet children({ pages, currentPage: activePage })}
							<div class="flex items-center gap-2">
								<Pagination.PrevButton
									class="cursor-pointer rounded-md border border-accent bg-white px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
								>
									<span>
										<i class="fa-solid fa-chevron-left"></i>
									</span>
								</Pagination.PrevButton>

								{#each pages as pageItem, i (i)}
									{#if pageItem.type === 'ellipsis'}
										<span class="cursor-not-allowed px-2 text-accent">...</span>
									{:else}
										<Pagination.Page
											page={pageItem}
											class="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors {pageItem.value ===
											activePage
												? 'border-accent bg-accent text-white'
												: 'border-accent bg-white text-primary hover:bg-accent hover:text-white'}"
										>
											{pageItem.value}
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
	</svelte:boundary>
</section>
