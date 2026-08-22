<script lang="ts">
	import { Locale, path, t, translateKey } from '$i18n';
	import { localeTabLabel } from '$lib/admin/blog/AdminBlogForm/model';
	import { uploadMedia } from '$remote/admin-media.remote';
	import { SITE_LOCATIONS, type UpsertProductDto } from '$remote/dto/product';
	import { toBase64 } from '$shared/global/functions/to-base64';
	import { Separator } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { v4 } from 'uuid';

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

	let isSubmitting = $state(false);
	let isUploadingImage = $state(false);
	let showIssues = $state(false);
	let activeLocale = $state<Locale>(Locale.plPL);
	let draft = $state<ProductDraft>(product ? productDraftFrom(product) : emptyProductDraft());

	const issues = $derived(validateProductDraft(draft));
	const hasIssues = $derived(Object.keys(issues).length > 0);

	/** Images only here - the wider `admin-media.remote.ts` list also allows video. */
	const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
	/** Mirrors `MAX_UPLOAD_BYTES` in `admin-media.remote.ts`. */
	const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

	async function handleImageSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		// Selecting the same file again should re-trigger `change`.
		input.value = '';

		if (!file) {
			return;
		}

		if (!IMAGE_MIME_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
			toast.error(t.admin.shop.fields.image.invalidFile);
			return;
		}

		isUploadingImage = true;

		try {
			const id = v4();
			// Remote function payloads are JSON, so the file travels base64 encoded.
			const { url } = await uploadMedia({
				id,
				mimeType: file.type,
				dataBase64: await toBase64(file)
			});

			// A replaced or abandoned upload is not deleted here - the save's
			// `cleanupMedia` or the bucket sweep takes care of it.
			draft.imageId = id;
			draft.imageUrl = url;
		} catch (error) {
			console.error('Failed to upload product image:', error);
			toast.error(t.admin.shop.fields.image.uploadError);
		} finally {
			isUploadingImage = false;
		}
	}

	function removeImage() {
		draft.imageId = '';
		draft.imageUrl = '';
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
			await onSubmit({
				slug: draft.slug,
				active: draft.active,
				siteLocations: draft.siteLocations,
				orderKey: draft.orderKey.trim() || undefined,
				imageId: draft.imageId || undefined,
				priceInMinorUnits,
				translations: toTranslationPayload(draft)
			});
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
	<h2 class="text-xl font-semibold tracking-tight">
		{isUpdateMode ? t.admin.shop.editor.update.title : t.admin.shop.editor.create.title}
	</h2>

	<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

	<p class="text-gray-600">
		{isUpdateMode ? t.admin.shop.editor.update.description : t.admin.shop.editor.create.description}
	</p>

	<form onsubmit={handleSubmit}>
		<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700" for="product-slug">
					{t.admin.shop.fields.slug.label}
				</label>
				<input
					id="product-slug"
					type="text"
					bind:value={draft.slug}
					placeholder={t.admin.shop.fields.slug.placeholder}
					class={`w-full rounded-md border focus:border-gray-500 ${showIssues && issues.slug ? 'border-danger' : 'border-gray-300'}`}
				/>
				<small class="block text-xs text-gray-500">{t.admin.shop.fields.slug.hint}</small>
				{#if showIssues && issues.slug}
					<small class="text-sm text-danger">{translateKey(issues.slug)}</small>
				{/if}
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700" for="product-price">
					{t.admin.shop.fields.price.label}
				</label>
				<input
					id="product-price"
					type="text"
					inputmode="decimal"
					bind:value={draft.price}
					placeholder={t.admin.shop.fields.price.placeholder}
					class={`w-full rounded-md border focus:border-gray-500 ${showIssues && issues.price ? 'border-danger' : 'border-gray-300'}`}
				/>
				<small class="block text-xs text-gray-500">{t.admin.shop.fields.price.hint}</small>
				{#if showIssues && issues.price}
					<small class="text-sm text-danger">{translateKey(issues.price)}</small>
				{/if}
			</div>
		</div>

		<div class="mt-4 flex flex-wrap items-center gap-6">
			<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
				<input type="checkbox" bind:checked={draft.active} />
				{t.admin.shop.fields.active.label}
			</label>

			{#each SITE_LOCATIONS as location (location)}
				<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
					<input
						type="checkbox"
						checked={draft.siteLocations.includes(location)}
						onchange={(event) => toggleSiteLocation(location, event.currentTarget.checked)}
					/>
					{location === 'shop' ? t.user.header.items.shop : t.user.header.items.registrations}
				</label>
			{/each}
		</div>
		<small class="mt-1 block text-xs text-gray-500">
			{t.admin.shop.fields.siteLocations.hint}
		</small>

		<!-- One image shared by every language version, so it sits outside the tabs. -->
		<div class="mt-6">
			<span class="mb-1 block text-sm font-medium text-gray-700">
				{t.admin.shop.fields.image.label}
			</span>

			{#if draft.imageUrl}
				<img
					src={draft.imageUrl}
					alt={t.admin.shop.fields.image.label}
					class="mb-3 h-40 w-64 rounded-md border border-gray-200 object-cover"
				/>
			{/if}

			<div class="flex flex-wrap items-center gap-3">
				<label
					class={`cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${isUploadingImage ? 'pointer-events-none opacity-70' : ''}`}
				>
					<span>
						<i
							class={`${isUploadingImage ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-image'} mr-2`}
						></i>
					</span>
					{draft.imageId ? t.admin.shop.fields.image.replace : t.admin.shop.fields.image.upload}
					<input
						type="file"
						accept={IMAGE_MIME_TYPES.join(',')}
						class="hidden"
						disabled={isUploadingImage}
						onchange={handleImageSelected}
					/>
				</label>

				{#if draft.imageId}
					<button
						type="button"
						class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-danger hover:bg-gray-50"
						onclick={removeImage}
					>
						<span>
							<i class="fa-solid fa-trash mr-2"></i>
						</span>
						{t.admin.shop.fields.image.remove}
					</button>
				{/if}
			</div>

			<small class="mt-1 block text-xs text-gray-500">{t.admin.shop.fields.image.hint}</small>
		</div>

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
					{localeTabLabel(locale)}
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
					{t.admin.languageTabs.enabled}
				</label>

				{#if draft.translations[locale].enabled}
					<div class="my-4">
						<label
							class="mb-1 block text-sm font-medium text-gray-700"
							for={`product-name-${locale}`}
						>
							{t.admin.shop.fields.name.label}
						</label>
						<input
							id={`product-name-${locale}`}
							type="text"
							bind:value={draft.translations[locale].name}
							placeholder={t.admin.shop.fields.name.placeholder}
							class="w-full rounded-md border border-gray-300 focus:border-gray-500"
						/>
					</div>

					<div class="my-4">
						<label
							class="mb-1 block text-sm font-medium text-gray-700"
							for={`product-description-${locale}`}
						>
							{t.admin.shop.fields.description.label}
						</label>
						<textarea
							id={`product-description-${locale}`}
							rows="5"
							bind:value={draft.translations[locale].description}
							placeholder={t.admin.shop.fields.description.placeholder}
							class="w-full rounded-md border border-gray-300 focus:border-gray-500"
						></textarea>
					</div>

					{#if showIssues && issues.names?.[locale]}
						<small class="text-sm text-danger">{translateKey(issues.names[locale]!)}</small>
					{/if}
				{/if}
			</div>
		{/each}

		{#if showIssues && issues.translations}
			<small class="mt-4 block text-sm text-danger">{translateKey(issues.translations)}</small>
		{/if}

		<div class="mt-6 flex justify-end gap-3">
			<a
				href={path('/admin/shop')}
				class="rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
			>
				{t.admin.shop.editor.cancel}
			</a>

			<button
				type="submit"
				class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
				disabled={isSubmitting || isUploadingImage}
			>
				{#if isSubmitting}
					<span><i class="fa-solid fa-spinner fa-spin mr-2"></i></span>
				{/if}
				{isUpdateMode ? t.admin.shop.editor.update.submit : t.admin.shop.editor.create.submit}
			</button>
		</div>
	</form>
</div>
