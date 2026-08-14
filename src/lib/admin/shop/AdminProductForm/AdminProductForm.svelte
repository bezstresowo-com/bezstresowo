<script lang="ts">
	import { Locale, t } from '$i18n';
	import { LOCALE_TAB_LABELS } from '$lib/admin/blog/AdminBlogForm/model';
	import { SITE_LOCATIONS, type UpsertProductDto } from '$remote/dto/product';
	import { slugify } from '$shared/global/functions/slugify';
	import { Dialog, Separator } from 'bits-ui';

	import {
		emptyProductDraft,
		productDraftFrom,
		toMinorUnits,
		toTranslationPayload,
		validateProductDraft,
		type ExistingProduct,
		type ProductDraft
	} from './model';

	interface Props {
		mode?: 'create' | 'update';
		product?: ExistingProduct;
		onSubmit?: (dto: UpsertProductDto) => Promise<boolean> | boolean;
	}

	let { mode = 'create', product, onSubmit }: Props = $props();

	const LOCALES = Object.values(Locale);
	const isUpdateMode = $derived(mode === 'update');

	let open = $state(false);
	let isSubmitting = $state(false);
	let showIssues = $state(false);
	let activeLocale = $state<Locale>(Locale.plPL);
	let draft = $state<ProductDraft>(product ? productDraftFrom(product) : emptyProductDraft());

	const issues = $derived(validateProductDraft(draft));
	const hasIssues = $derived(Object.keys(issues).length > 0);

	function reset() {
		draft = product ? productDraftFrom(product) : emptyProductDraft();
		activeLocale = Locale.plPL;
		showIssues = false;
	}

	function onNameInput(locale: Locale) {
		// The slug follows the polish name until it is edited by hand.
		if (!draft.slugTouched && locale === Locale.plPL) {
			draft.slug = slugify(draft.translations[locale].name);
		}
	}

	function toggleSiteLocation(location: (typeof SITE_LOCATIONS)[number], checked: boolean) {
		draft.siteLocations = checked
			? [...new Set([...draft.siteLocations, location])]
			: draft.siteLocations.filter((candidate) => candidate !== location);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		showIssues = true;

		const priceInMinorUnits = toMinorUnits(draft.price);

		if (hasIssues || priceInMinorUnits === null || !onSubmit) {
			return;
		}

		isSubmitting = true;

		try {
			const success = await onSubmit({
				slug: draft.slug,
				active: draft.active,
				siteLocations: draft.siteLocations,
				orderKey: draft.orderKey.trim() || undefined,
				priceInMinorUnits,
				translations: toTranslationPayload(draft)
			});

			if (success) {
				open = false;
				reset();
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog.Root
	bind:open
	onOpenChange={(newOpen) => {
		open = newOpen;
		if (!newOpen) reset();
	}}
>
	<Dialog.Trigger class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
		<span>
			<i class={isUpdateMode ? 'fa-solid fa-edit' : 'fa-solid fa-plus'}></i>
		</span>
		{t(isUpdateMode ? 'admin.shop.actions.edit' : 'admin.shop.actions.create')}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80">
			<Dialog.Content
				class="fixed top-[50%] left-[50%] z-50 max-h-[calc(100dvh-2rem)] w-[min(50rem,_calc(100dvw-2rem))] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-md border bg-white p-5 outline-hidden"
			>
				<Dialog.Title
					class="flex w-full items-center justify-center text-xl font-semibold tracking-tight"
				>
					{t(isUpdateMode ? 'admin.shop.dialog.update.title' : 'admin.shop.dialog.create.title')}
				</Dialog.Title>

				<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

				<Dialog.Description>
					{t(
						isUpdateMode
							? 'admin.shop.dialog.update.description'
							: 'admin.shop.dialog.create.description'
					)}
				</Dialog.Description>

				<form onsubmit={handleSubmit}>
					<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700" for="product-slug">
								{t('admin.shop.fields.slug.label')}
							</label>
							<input
								id="product-slug"
								type="text"
								bind:value={draft.slug}
								oninput={() => (draft.slugTouched = true)}
								placeholder={t('admin.shop.fields.slug.placeholder')}
								class={`w-full rounded-md border focus:border-gray-500 ${showIssues && issues.slug ? 'border-danger' : 'border-gray-300'}`}
							/>
							<small class="block text-xs text-gray-500">{t('admin.shop.fields.slug.hint')}</small>
							{#if showIssues && issues.slug}
								<small class="text-sm text-danger">{t(issues.slug)}</small>
							{/if}
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700" for="product-price">
								{t('admin.shop.fields.price.label')}
							</label>
							<input
								id="product-price"
								type="text"
								inputmode="decimal"
								bind:value={draft.price}
								placeholder={t('admin.shop.fields.price.placeholder')}
								class={`w-full rounded-md border focus:border-gray-500 ${showIssues && issues.price ? 'border-danger' : 'border-gray-300'}`}
							/>
							<small class="block text-xs text-gray-500">{t('admin.shop.fields.price.hint')}</small>
							{#if showIssues && issues.price}
								<small class="text-sm text-danger">{t(issues.price)}</small>
							{/if}
						</div>
					</div>

					<div class="mt-4 flex flex-wrap items-center gap-6">
						<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
							<input type="checkbox" bind:checked={draft.active} />
							{t('admin.shop.fields.active.label')}
						</label>

						{#each SITE_LOCATIONS as location (location)}
							<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
								<input
									type="checkbox"
									checked={draft.siteLocations.includes(location)}
									onchange={(event) => toggleSiteLocation(location, event.currentTarget.checked)}
								/>
								{location === 'shop'
									? t('user.header.items.shop')
									: t('user.header.items.registrations')}
							</label>
						{/each}
					</div>
					{#if showIssues && issues.siteLocations}
						<small class="text-sm text-danger">{t(issues.siteLocations)}</small>
					{/if}

					<!-- One tab per supported language; a product may exist in just one. -->
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
								{#if draft.translations[locale].enabled}
									<i class="fa-solid fa-circle-check ml-1 text-green-600"></i>
								{/if}
							</button>
						{/each}
					</div>

					{#each LOCALES as locale (locale)}
						<div class={activeLocale === locale ? 'block' : 'hidden'}>
							<label class="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700">
								<input type="checkbox" bind:checked={draft.translations[locale].enabled} />
								{t('admin.languageTabs.enabled')}
							</label>

							{#if draft.translations[locale].enabled}
								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`product-name-${locale}`}
									>
										{t('admin.shop.fields.name.label')}
									</label>
									<input
										id={`product-name-${locale}`}
										type="text"
										bind:value={draft.translations[locale].name}
										oninput={() => onNameInput(locale)}
										placeholder={t('admin.shop.fields.name.placeholder')}
										class="w-full rounded-md border border-gray-300 focus:border-gray-500"
									/>
								</div>

								<div class="my-4">
									<label
										class="mb-1 block text-sm font-medium text-gray-700"
										for={`product-description-${locale}`}
									>
										{t('admin.shop.fields.description.label')}
									</label>
									<textarea
										id={`product-description-${locale}`}
										rows="5"
										bind:value={draft.translations[locale].description}
										placeholder={t('admin.shop.fields.description.placeholder')}
										class="w-full rounded-md border border-gray-300 focus:border-gray-500"
									></textarea>
								</div>

								{#if showIssues && issues.names?.[locale]}
									<small class="text-sm text-danger">{t(issues.names[locale]!)}</small>
								{/if}
							{/if}
						</div>
					{/each}

					{#if showIssues && issues.translations}
						<small class="mt-4 block text-sm text-danger">{t(issues.translations)}</small>
					{/if}

					<div class="mt-6 flex justify-end gap-3">
						<Dialog.Close
							class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
						>
							{t('admin.shop.dialog.cancel')}
						</Dialog.Close>

						<button
							type="submit"
							class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<span><i class="fa-solid fa-spinner fa-spin mr-2"></i></span>
							{/if}
							{t(
								isUpdateMode ? 'admin.shop.dialog.update.submit' : 'admin.shop.dialog.create.submit'
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
