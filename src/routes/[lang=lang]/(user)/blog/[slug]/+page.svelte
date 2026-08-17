<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, path, t } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { getBlogArticle } from '$remote/blog.remote';

	const article = $derived(getBlogArticle({ lang: getLocale(), slug: page.params.slug as string }));
</script>

<svelte:boundary>
	{#snippet pending()}
		<div class="flex justify-center py-20">
			<LoadingSpinner size="lg" />
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<Seo title={t.user.pages.blog.article.notFoundTitle} noindex />

		<section class="mx-auto max-w-4xl px-4 py-8 sm:py-12">
			<ErrorNotice {error} {reset} />

			<div class="mt-6 text-center">
				<Button
					href={path('/blog')}
					tailwind="bg-white border border-accent text-primary px-6 py-3"
				>
					{t.user.pages.blog.article.back}
				</Button>
			</div>
		</section>
	{/snippet}

	{@const post = await article}

	<Seo
		title={post.metaTitle}
		description={post.metaDescription}
		ogType="article"
		image={post.featuredImageUrl ?? undefined}
		imageAlt={post.featuredImageAlt ?? undefined}
		jsonLd={post.metadataJsonLD}
		alternates={post.alternates.map((alternate) => ({
			locale: alternate.lang,
			path: `/blog/${alternate.slug}`
		}))}
	/>

	<section class="mx-auto max-w-4xl px-4 py-8 sm:py-12">
		<div class="mb-8">
			<Button
				href={path('/blog')}
				tailwind="bg-white border border-accent text-primary px-6 py-3 mt-5"
			>
				<i class="fa-solid fa-arrow-left mr-2"></i>
				{t.user.pages.blog.article.back}
			</Button>
		</div>

		<article class="rounded-lg bg-white p-4 shadow-sm sm:p-8">
			<header class="mb-8 border-b border-gray-100 pb-8">
				<div class="mb-4 text-sm text-accent">
					{t.user.pages.blog.article.publishedAt}:
					<time datetime={new Date(post.createdAt).toISOString()}>
						{new Date(post.createdAt).toLocaleDateString(getLocale(), {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
					&middot; {t.user.pages.blog.article.author}
				</div>
				<h1 class="text-3xl font-bold text-primary sm:text-4xl">
					{post.title}
				</h1>
			</header>

			{#if post.featuredImageUrl}
				<img
					class="mb-8 w-full rounded-lg object-cover"
					src={post.featuredImageUrl}
					alt={post.featuredImageAlt ?? post.title}
					loading="lazy"
				/>
			{/if}

			<div class="prose max-w-none text-gray-600 sm:prose-lg">
				{@html post.content}
			</div>

			<!-- Contact call to action, in the language of the article. -->
			<aside
				class="mt-12 flex flex-col items-center gap-4 rounded-lg border border-accent bg-background/60 p-6 text-center"
			>
				<p class="text-lg text-primary">
					{t.user.pages.blog.article.contactCtaDescription}
				</p>
				<Button
					href={path('/registrations')}
					tailwind="bg-accent border border-accent text-primary px-6 py-3"
				>
					{t.user.pages.blog.article.contactCta}
				</Button>
			</aside>
		</article>
	</section>

	<!-- Sticky variant for long reads, mobile first. -->
	<div class="pointer-events-none sticky bottom-4 z-50 flex justify-center px-4 pb-4">
		<a
			class="pointer-events-auto rounded-full bg-accent px-6 py-3 font-medium text-primary shadow-lg transition hover:bg-accent/90"
			href={path('/registrations')}
		>
			{t.user.pages.blog.article.contactCta}
		</a>
	</div>
</svelte:boundary>
