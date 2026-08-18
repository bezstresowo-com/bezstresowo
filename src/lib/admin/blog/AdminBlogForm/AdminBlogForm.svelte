<script lang="ts">
	import { Locale, path, t, translateKey } from '$i18n';
	import TipTap from '$lib/TipTap/TipTap.svelte';
	import type { InternationalizedBlogArticleDto } from '$remote/dto/blog';
	import { Separator } from 'bits-ui';

	import {
		draftsFrom,
		emptyDrafts,
		localeTabLabel,
		META_DESCRIPTION_MAX_LENGTH,
		META_TITLE_MAX_LENGTH,
		toPayload,
		validateDraft,
		validateSlug,
		type DraftIssues,
		type ExistingTranslation,
		type TranslationDrafts
	} from './model';

	interface Props {
		mode?: 'create' | 'update';
		/** `slug` is nullable in the schema for legacy rows the panel never loads. */
		article?: { slug: string | null; internationalizedArticles: ExistingTranslation[] };
		onSubmit?: (payload: {
			slug: string;
			translations: InternationalizedBlogArticleDto[];
		}) => Promise<boolean> | boolean;
	}

	let { mode = 'create', article, onSubmit }: Props = $props();

	const LOCALES = Object.values(Locale);
	const isUpdateMode = $derived(mode === 'update');

	let isSubmitting = $state(false);
	let activeLocale = $state<Locale>(Locale.plPL);
	// One slug for every language version of the article, ideally english.
	let slug = $state(article?.slug ?? '');
	let drafts = $state<TranslationDrafts>(
		article ? draftsFrom(article.internationalizedArticles) : emptyDrafts()
	);
	let showIssues = $state(false);

	const enabledLocales = $derived(LOCALES.filter((locale) => drafts[locale].enabled));
	const slugIssue = $derived(validateSlug(slug));
	const issues = $derived(
		Object.fromEntries(
			enabledLocales.map((locale) => [locale, validateDraft(drafts[locale])])
		) as Record<Locale, DraftIssues>
	);
	const hasIssues = $derived(
		enabledLocales.length === 0 ||
			slugIssue !== undefined ||
			enabledLocales.some((locale) => Object.keys(issues[locale] ?? {}).length > 0)
	);

	function issueFor(locale: Locale, field: keyof DraftIssues) {
		return showIssues ? issues[locale]?.[field] : undefined;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		showIssues = true;

		if (hasIssues || !onSubmit) {
			return;
		}

		isSubmitting = true;

		try {
			await onSubmit({
				slug,
				translations: enabledLocales.map((locale) => toPayload(locale, drafts[locale]))
			});
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
	<h2 class="text-xl font-semibold tracking-tight">
		{isUpdateMode ? t.admin.blog.editor.update.title : t.admin.blog.editor.create.title}
	</h2>

	<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

	<p class="text-gray-600">
		{isUpdateMode ? t.admin.blog.editor.update.description : t.admin.blog.editor.create.description}
	</p>

	<form onsubmit={handleSubmit}>
		<div class="mt-6">
			<label class="mb-1 block text-sm font-medium text-gray-700" for="article-slug">
				{t.admin.seoFields.slug.label}
			</label>
			<input
				id="article-slug"
				type="text"
				bind:value={slug}
				placeholder={t.admin.seoFields.slug.placeholder}
				class={`w-full rounded-md border focus:border-gray-500 ${showIssues && slugIssue ? 'border-danger' : 'border-gray-300'}`}
			/>
			<small class="block text-xs text-gray-500">{t.admin.seoFields.slug.hint}</small>
			{#if showIssues && slugIssue}
				<small class="text-sm text-danger">{translateKey(slugIssue)}</small>
			{/if}
		</div>

		<!-- One tab per supported language; an article may exist in just one. -->
		<div class="mt-6 flex gap-2 border-b border-gray-200">
			{#each LOCALES as locale (locale)}
				<button
					type="button"
					class={`cursor-pointer rounded-t-md px-4 py-2 text-sm font-medium ${
						activeLocale === locale
							? 'border border-gray-200 border-b-white bg-white text-gray-900'
							: 'text-gray-500 hover:text-gray-800'
					}`}
					onclick={() => (activeLocale = locale)}
				>
					{localeTabLabel(locale)}
					{#if drafts[locale].enabled}
						<i class="fa-solid fa-circle-check ml-1 text-green-600"></i>
					{:else if drafts[locale].existing}
						<i class="fa-solid fa-eye-slash ml-1 text-gray-400"></i>
					{/if}
				</button>
			{/each}
		</div>

		{#each LOCALES as locale (locale)}
			<div class={activeLocale === locale ? 'block' : 'hidden'}>
				<label class="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700">
					<input type="checkbox" bind:checked={drafts[locale].enabled} />
					{t.admin.languageTabs.enabled}
				</label>

				{#if !drafts[locale].enabled && drafts[locale].existing}
					<!-- Toggling a version off never deletes it - see the server side. -->
					<small class="mt-1 block text-xs text-gray-500">
						{t.admin.languageTabs.disabledHint}
					</small>
				{/if}

				{#if drafts[locale].enabled}
					<div class="my-4">
						<label class="mb-1 block text-sm font-medium text-gray-700" for={`title-${locale}`}>
							{t.admin.blog.editor.fields.title.label}
						</label>
						<input
							id={`title-${locale}`}
							type="text"
							bind:value={drafts[locale].title}
							placeholder={t.admin.blog.editor.fields.title.placeholder}
							class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'title') ? 'border-danger' : 'border-gray-300'}`}
						/>
						{#if issueFor(locale, 'title')}
							<small class="text-sm text-danger">{translateKey(issueFor(locale, 'title')!)}</small>
						{/if}
					</div>

					<div class="my-4">
						<label class="mb-1 block text-sm font-medium text-gray-700" for={`metaTitle-${locale}`}>
							{t.admin.seoFields.metaTitle.label}
						</label>
						<input
							id={`metaTitle-${locale}`}
							type="text"
							bind:value={drafts[locale].metaTitle}
							placeholder={t.admin.seoFields.metaTitle.placeholder}
							class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'metaTitle') ? 'border-danger' : 'border-gray-300'}`}
						/>
						<small class="block text-xs text-gray-500">
							{t.admin.seoFields.charactersLeft({
								count: META_TITLE_MAX_LENGTH - drafts[locale].metaTitle.length
							})}
						</small>
						{#if issueFor(locale, 'metaTitle')}
							<small class="text-sm text-danger"
								>{translateKey(issueFor(locale, 'metaTitle')!)}</small
							>
						{/if}
					</div>

					<div class="my-4">
						<label
							class="mb-1 block text-sm font-medium text-gray-700"
							for={`metaDescription-${locale}`}
						>
							{t.admin.seoFields.metaDescription.label}
						</label>
						<textarea
							id={`metaDescription-${locale}`}
							rows="3"
							bind:value={drafts[locale].metaDescription}
							placeholder={t.admin.seoFields.metaDescription.placeholder}
							class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'metaDescription') ? 'border-danger' : 'border-gray-300'}`}
						></textarea>
						<small class="block text-xs text-gray-500">
							{t.admin.seoFields.charactersLeft({
								count: META_DESCRIPTION_MAX_LENGTH - drafts[locale].metaDescription.length
							})}
						</small>
						{#if issueFor(locale, 'metaDescription')}
							<small class="text-sm text-danger">
								{translateKey(issueFor(locale, 'metaDescription')!)}
							</small>
						{/if}
					</div>

					<div class="my-4">
						<label
							class="mb-1 block text-sm font-medium text-gray-700"
							for={`featuredImageAlt-${locale}`}
						>
							{t.admin.seoFields.featuredImageAlt.label}
						</label>
						<input
							id={`featuredImageAlt-${locale}`}
							type="text"
							bind:value={drafts[locale].featuredImageAlt}
							placeholder={t.admin.seoFields.featuredImageAlt.placeholder}
							class="w-full rounded-md border border-gray-300 focus:border-gray-500"
						/>
					</div>

					<TipTap
						content={drafts[locale].content}
						onUpdate={(html, mediaIds) => {
							drafts[locale].content = html;
							// The editor reports what the document actually contains, so
							// removed media drop out of the payload and get cleaned up
							// server side after the save.
							drafts[locale].media = Object.fromEntries(
								mediaIds.map((id) => [id, drafts[locale].media[id] ?? id])
							);

							// The first image of the article doubles as the featured one;
							// it follows the document when its image is removed.
							if (!mediaIds.includes(drafts[locale].featuredImageId)) {
								drafts[locale].featuredImageId = mediaIds[0] ?? '';
							}
						}}
					/>

					{#if issueFor(locale, 'content')}
						<small class="text-sm text-danger">{translateKey(issueFor(locale, 'content')!)}</small>
					{/if}
				{/if}
			</div>
		{/each}

		{#if showIssues && enabledLocales.length === 0}
			<small class="mt-4 block text-sm text-danger">
				{t.admin.languageTabs.atLeastOne}
			</small>
		{/if}

		<div class="mt-6 flex justify-end gap-3">
			<a
				href={path('/admin/blog')}
				class="rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
			>
				{t.admin.blog.editor.cancel}
			</a>

			<button
				type="submit"
				class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					<span><i class="fa-solid fa-spinner fa-spin mr-2"></i></span>
				{:else}
					<span>
						<i class={`${isUpdateMode ? 'fa-solid fa-save' : 'fa-solid fa-check'} mr-2`}></i>
					</span>
				{/if}
				{isUpdateMode ? t.admin.blog.editor.update.submit : t.admin.blog.editor.create.submit}
			</button>
		</div>
	</form>
</div>
