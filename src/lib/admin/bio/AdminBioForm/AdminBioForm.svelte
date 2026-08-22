<script lang="ts">
	import { Locale, path, t, translateKey } from '$i18n';
	import { localeTabLabel } from '$lib/admin/blog/AdminBlogForm/model';
	import TipTap from '$lib/TipTap/TipTap.svelte';
	import { uploadMedia } from '$remote/admin-media.remote';
	import type { UpsertBioDto } from '$remote/dto/bio';
	import { toBase64 } from '$shared/global/functions/to-base64';
	import { Separator } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { v4 } from 'uuid';

	import {
		bioDraftFrom,
		emptyBioDraft,
		toBioTranslationPayload,
		validateBioDraft,
		type BioDraft,
		type ExistingBio
	} from './model';

	interface Props {
		bio?: ExistingBio | null;
		onSubmit?: (dto: UpsertBioDto) => Promise<boolean> | boolean;
	}

	let { bio, onSubmit }: Props = $props();

	const LOCALES = Object.values(Locale);

	let isSubmitting = $state(false);
	let isUploadingImage = $state(false);
	let showIssues = $state(false);
	let activeLocale = $state<Locale>(Locale.plPL);
	let draft = $state<BioDraft>(bio ? bioDraftFrom(bio) : emptyBioDraft());

	const issues = $derived(validateBioDraft(draft));
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
			toast.error(t.admin.bio.fields.image.invalidFile);
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
			console.error('Failed to upload bio image:', error);
			toast.error(t.admin.bio.fields.image.uploadError);
		} finally {
			isUploadingImage = false;
		}
	}

	function removeImage() {
		draft.imageId = '';
		draft.imageUrl = '';
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
				imageId: draft.imageId || undefined,
				translations: toBioTranslationPayload(draft)
			});
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
	<h2 class="text-xl font-semibold tracking-tight">{t.admin.bio.editor.title}</h2>

	<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

	<p class="text-gray-600">{t.admin.bio.editor.description}</p>

	<form onsubmit={handleSubmit}>
		<!-- One portrait shared by every language version, so it sits outside the tabs. -->
		<div class="mt-6">
			<span class="mb-1 block text-sm font-medium text-gray-700">
				{t.admin.bio.fields.image.label}
			</span>

			{#if draft.imageUrl}
				<img
					src={draft.imageUrl}
					alt={t.admin.bio.fields.image.label}
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
					{draft.imageId ? t.admin.bio.fields.image.replace : t.admin.bio.fields.image.upload}
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
						{t.admin.bio.fields.image.remove}
					</button>
				{/if}
			</div>

			<small class="mt-1 block text-xs text-gray-500">{t.admin.bio.fields.image.hint}</small>
		</div>

		<!-- One tab per supported language; the section may exist in just one. -->
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
						<span class="mb-1 block text-sm font-medium text-gray-700">
							{t.admin.bio.fields.content.label}
						</span>

						<TipTap
							content={draft.translations[locale].content}
							onUpdate={(html, mediaIds) => {
								draft.translations[locale].content = html;
								// The editor reports what the document actually contains, so
								// removed media drop out of the payload and get cleaned up
								// server side after the save.
								draft.translations[locale].media = Object.fromEntries(
									mediaIds.map((id) => [id, draft.translations[locale].media[id] ?? id])
								);
							}}
						/>

						{#if showIssues && issues.contents?.[locale]}
							<small class="text-sm text-danger">{translateKey(issues.contents[locale]!)}</small>
						{/if}
					</div>
				{/if}
			</div>
		{/each}

		{#if showIssues && issues.translations}
			<small class="mt-4 block text-sm text-danger">{translateKey(issues.translations)}</small>
		{/if}

		<div class="mt-6 flex justify-end gap-3">
			<a
				href={path('/admin')}
				class="rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
			>
				{t.admin.bio.editor.cancel}
			</a>

			<button
				type="submit"
				class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
				disabled={isSubmitting || isUploadingImage}
			>
				{#if isSubmitting}
					<span><i class="fa-solid fa-spinner fa-spin mr-2"></i></span>
					{t.admin.bio.editor.submitLoading}
				{:else}
					<span><i class="fa-solid fa-save mr-2"></i></span>
					{t.admin.bio.editor.submit}
				{/if}
			</button>
		</div>
	</form>
</div>
