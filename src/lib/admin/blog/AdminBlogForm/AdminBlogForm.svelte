<script lang="ts">
	import { Locale, t } from '$i18n';
	import TipTap from '$lib/TipTap/TipTap.svelte';
	import type { InternationalizedBlogArticleDto } from '$remote/dto/blog';
	import { slugify } from '$shared/global/functions/slugify';
	import { Dialog, Separator } from 'bits-ui';

	import {
		draftsFrom,
		emptyDrafts,
		LOCALE_TAB_LABELS,
		META_DESCRIPTION_MAX_LENGTH,
		META_TITLE_MAX_LENGTH,
		toPayload,
		validateDraft,
		type DraftIssues,
		type ExistingTranslation,
		type TranslationDrafts
	} from './model';

	interface Props {
		mode?: 'create' | 'update';
		initialTranslations?: ExistingTranslation[];
		onSubmit?: (translations: InternationalizedBlogArticleDto[]) => Promise<boolean> | boolean;
	}

	let { mode = 'create', initialTranslations, onSubmit }: Props = $props();

	const LOCALES = Object.values(Locale);
	const isUpdateMode = $derived(mode === 'update');

	let open = $state(false);
	let isSubmitting = $state(false);
	let activeLocale = $state<Locale>(Locale.plPL);
	let drafts = $state<TranslationDrafts>(
		initialTranslations ? draftsFrom(initialTranslations) : emptyDrafts()
	);
	let showIssues = $state(false);

	const enabledLocales = $derived(LOCALES.filter((locale) => drafts[locale].enabled));
	const issues = $derived(
		Object.fromEntries(
			enabledLocales.map((locale) => [locale, validateDraft(drafts[locale])])
		) as Record<Locale, DraftIssues>
	);
	const hasIssues = $derived(
		enabledLocales.length === 0 ||
			enabledLocales.some((locale) => Object.keys(issues[locale] ?? {}).length > 0)
	);

	function issueFor(locale: Locale, field: keyof DraftIssues) {
		return showIssues ? issues[locale]?.[field] : undefined;
	}

	function onTitleInput(locale: Locale) {
		// The slug follows the title until it is edited by hand.
		if (!drafts[locale].slugTouched) {
			drafts[locale].slug = slugify(drafts[locale].title);
		}
	}

	function reset() {
		drafts = initialTranslations ? draftsFrom(initialTranslations) : emptyDrafts();
		activeLocale = Locale.plPL;
		showIssues = false;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		showIssues = true;

		if (hasIssues || !onSubmit) {
			return;
		}

		isSubmitting = true;

		try {
			const success = await onSubmit(
				enabledLocales.map((locale) => toPayload(locale, drafts[locale]))
			);

			if (success) {
				open = false;
				reset();
			}
		} finally {
			isSubmitting = false;
		}
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;

		if (!newOpen) {
			reset();
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Trigger class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
		<span>
			<i class={isUpdateMode ? 'fa-solid fa-edit' : 'fa-solid fa-plus'}></i>
		</span>
		{t(isUpdateMode ? 'admin.blog.dialog.update.trigger' : 'admin.blog.dialog.create.trigger')}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80">
			<Dialog.Content
				class="fixed top-[50%] left-[50%] z-50 max-h-[calc(100dvh-2rem)] w-[min(50rem,_calc(100dvw-2rem))] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-md border bg-white p-5 outline-hidden"
			>
				<Dialog.Title
					class="flex w-full items-center justify-center text-xl font-semibold tracking-tight"
				>
					{t(isUpdateMode ? 'admin.blog.dialog.update.title' : 'admin.blog.dialog.create.title')}
				</Dialog.Title>

				<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

				<Dialog.Description>
					{t(
						isUpdateMode
							? 'admin.blog.dialog.update.description'
							: 'admin.blog.dialog.create.description'
					)}
				</Dialog.Description>

				<form onsubmit={handleSubmit}>
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
								{t(LOCALE_TAB_LABELS[locale])}
								{#if drafts[locale].enabled}
									<i class="fa-solid fa-circle-check ml-1 text-green-600"></i>
								{/if}
							</button>
						{/each}
					</div>

					{#each LOCALES as locale (locale)}
						<div class={activeLocale === locale ? 'block' : 'hidden'}>
							<label class="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700">
								<input type="checkbox" bind:checked={drafts[locale].enabled} />
								{t('admin.languageTabs.enabled')}
							</label>

							{#if drafts[locale].enabled}
								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`title-${locale}`}
									>
										{t('admin.blog.dialog.form.fields.title.label')}
									</label>
									<input
										id={`title-${locale}`}
										type="text"
										bind:value={drafts[locale].title}
										oninput={() => onTitleInput(locale)}
										placeholder={t('admin.blog.dialog.form.fields.title.placeholder')}
										class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'title') ? 'border-danger' : 'border-gray-300'}`}
									/>
									{#if issueFor(locale, 'title')}
										<small class="text-sm text-danger">{t(issueFor(locale, 'title')!)}</small>
									{/if}
								</div>

								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`slug-${locale}`}
									>
										{t('admin.seoFields.slug.label')}
									</label>
									<input
										id={`slug-${locale}`}
										type="text"
										bind:value={drafts[locale].slug}
										oninput={() => (drafts[locale].slugTouched = true)}
										placeholder={t('admin.seoFields.slug.placeholder')}
										class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'slug') ? 'border-danger' : 'border-gray-300'}`}
									/>
									<small class="block text-xs text-gray-500">{t('admin.seoFields.slug.hint')}</small
									>
									{#if issueFor(locale, 'slug')}
										<small class="text-sm text-danger">{t(issueFor(locale, 'slug')!)}</small>
									{/if}
								</div>

								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`metaTitle-${locale}`}
									>
										{t('admin.seoFields.metaTitle.label')}
									</label>
									<input
										id={`metaTitle-${locale}`}
										type="text"
										bind:value={drafts[locale].metaTitle}
										placeholder={t('admin.seoFields.metaTitle.placeholder')}
										class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'metaTitle') ? 'border-danger' : 'border-gray-300'}`}
									/>
									<small class="block text-xs text-gray-500">
										{t('admin.seoFields.charactersLeft', {
											count: META_TITLE_MAX_LENGTH - drafts[locale].metaTitle.length
										})}
									</small>
									{#if issueFor(locale, 'metaTitle')}
										<small class="text-sm text-danger">{t(issueFor(locale, 'metaTitle')!)}</small>
									{/if}
								</div>

								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`metaDescription-${locale}`}
									>
										{t('admin.seoFields.metaDescription.label')}
									</label>
									<textarea
										id={`metaDescription-${locale}`}
										rows="3"
										bind:value={drafts[locale].metaDescription}
										placeholder={t('admin.seoFields.metaDescription.placeholder')}
										class={`w-full rounded-md border focus:border-gray-500 ${issueFor(locale, 'metaDescription') ? 'border-danger' : 'border-gray-300'}`}
									></textarea>
									<small class="block text-xs text-gray-500">
										{t('admin.seoFields.charactersLeft', {
											count: META_DESCRIPTION_MAX_LENGTH - drafts[locale].metaDescription.length
										})}
									</small>
									{#if issueFor(locale, 'metaDescription')}
										<small class="text-sm text-danger">
											{t(issueFor(locale, 'metaDescription')!)}
										</small>
									{/if}
								</div>

								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`featuredImageAlt-${locale}`}
									>
										{t('admin.seoFields.featuredImageAlt.label')}
									</label>
									<input
										id={`featuredImageAlt-${locale}`}
										type="text"
										bind:value={drafts[locale].featuredImageAlt}
										placeholder={t('admin.seoFields.featuredImageAlt.placeholder')}
										class="w-full rounded-md border border-gray-300 focus:border-gray-500"
									/>
								</div>

								<TipTap
									content={drafts[locale].content}
									onUpdate={(html, addedMedia) => {
										drafts[locale].content = html;
										drafts[locale].media = { ...drafts[locale].media, ...addedMedia };

										// The first image of the article doubles as the featured one.
										const [firstMediaId] = Object.keys(drafts[locale].media);
										if (!drafts[locale].featuredImageId && firstMediaId) {
											drafts[locale].featuredImageId = firstMediaId;
										}
									}}
								/>

								{#if issueFor(locale, 'content')}
									<small class="text-sm text-danger">{t(issueFor(locale, 'content')!)}</small>
								{/if}
							{/if}
						</div>
					{/each}

					{#if showIssues && enabledLocales.length === 0}
						<small class="mt-4 block text-sm text-danger">
							{t('admin.languageTabs.atLeastOne')}
						</small>
					{/if}

					<div class="mt-6 flex justify-end gap-3">
						<Dialog.Close
							class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
						>
							{t('admin.blog.dialog.cancel')}
						</Dialog.Close>

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
							{t(
								isUpdateMode ? 'admin.blog.dialog.update.submit' : 'admin.blog.dialog.create.submit'
							)}
						</button>
					</div>
				</form>

				<Dialog.Close class="absolute top-5 right-5 cursor-pointer rounded-md">
					<div>
						<span><i class="fa-solid fa-xmark"></i></span>
						<span class="sr-only">Close</span>
					</div>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Overlay>
	</Dialog.Portal>
</Dialog.Root>
