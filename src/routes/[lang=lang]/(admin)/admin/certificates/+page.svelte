<script lang="ts">
	import { Locale, path, t } from '$i18n';
	import AdminDeleteDialog from '$lib/admin/AdminDeleteDialog/AdminDeleteDialog.svelte';
	import { localeTabLabel } from '$lib/admin/blog/AdminBlogForm/model';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import {
		createCertificate,
		deleteCertificate,
		getAdminCertificates,
		reorderCertificates,
		updateCertificate
	} from '$remote/admin-certificates.remote';
	import { uploadMedia } from '$remote/admin-media.remote';
	import type { AdminCertificate } from '$remote/dto/certificate';
	import { toBase64 } from '$shared/global/functions/to-base64';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { v4 } from 'uuid';

	const LOCALES = Object.values(Locale);

	/** Images only here - the wider `admin-media.remote.ts` list also allows video. */
	const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
	/** Mirrors `MAX_UPLOAD_BYTES` in `admin-media.remote.ts`. */
	const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

	/**
	 * The gallery lives in mutable local state (not a plain `await`ed query) so
	 * drag reordering can shuffle it live before the order is persisted.
	 */
	let certificates = $state<AdminCertificate[]>([]);
	let altDrafts = $state<Record<string, Partial<Record<Locale, string>>>>({});
	let isLoading = $state(true);
	let loadError = $state<unknown>(null);

	let draggedId = $state<string | null>(null);
	let savingAltsId = $state<string | null>(null);
	let deletingId = $state<string | null>(null);

	// The add form.
	let newImageId = $state('');
	let newImageUrl = $state('');
	let newAlts = $state<Partial<Record<Locale, string>>>({});
	let isUploadingImage = $state(false);
	let isAdding = $state(false);

	onMount(load);

	async function load() {
		isLoading = true;
		loadError = null;

		try {
			certificates = await getAdminCertificates();
			altDrafts = Object.fromEntries(
				certificates.map((certificate) => [certificate.id, { ...certificate.altTexts }])
			);
		} catch (error) {
			console.error('Failed to load certificates:', error);
			loadError = error;
		} finally {
			isLoading = false;
		}
	}

	/* ------------------------------- reordering ------------------------------- */

	function moveCertificate(fromIndex: number, toIndex: number) {
		if (toIndex < 0 || toIndex >= certificates.length || fromIndex === toIndex) {
			return;
		}

		const next = [...certificates];
		const [moved] = next.splice(fromIndex, 1);
		next.splice(toIndex, 0, moved);
		certificates = next;
	}

	async function persistOrder() {
		try {
			await reorderCertificates({ ids: certificates.map((certificate) => certificate.id) });
			toast.success(t.admin.certificates.notifications.reorderSuccess);
		} catch (error) {
			console.error('Failed to reorder certificates:', error);
			toast.error(t.admin.certificates.notifications.reorderError);
			// The local order no longer matches the database - reload the truth.
			await load();
		}
	}

	function handleDragStart(event: DragEvent, id: string) {
		draggedId = id;

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', id);
		}
	}

	/** Live preview: the dragged card takes the hovered card's slot. */
	function handleDragOver(event: DragEvent, targetId: string) {
		event.preventDefault();

		if (draggedId === null || draggedId === targetId) {
			return;
		}

		const fromIndex = certificates.findIndex((certificate) => certificate.id === draggedId);
		const toIndex = certificates.findIndex((certificate) => certificate.id === targetId);

		if (fromIndex !== -1 && toIndex !== -1) {
			moveCertificate(fromIndex, toIndex);
		}
	}

	async function handleDragEnd() {
		if (draggedId === null) {
			return;
		}

		draggedId = null;
		await persistOrder();
	}

	async function handleMove(index: number, delta: number) {
		moveCertificate(index, index + delta);
		await persistOrder();
	}

	/* -------------------------------- alt texts ------------------------------- */

	function altsDirty(certificate: AdminCertificate): boolean {
		return LOCALES.some(
			(locale) =>
				(altDrafts[certificate.id]?.[locale] ?? '').trim() !== (certificate.altTexts[locale] ?? '')
		);
	}

	async function handleSaveAlts(certificate: AdminCertificate) {
		savingAltsId = certificate.id;

		try {
			const updated = await updateCertificate({
				id: certificate.id,
				alts: LOCALES.map((locale) => ({
					lang: locale,
					text: altDrafts[certificate.id]?.[locale] ?? ''
				}))
			});

			certificates = certificates.map((candidate) =>
				candidate.id === certificate.id ? { ...candidate, altTexts: updated.altTexts } : candidate
			);
			altDrafts[certificate.id] = { ...updated.altTexts };
			toast.success(t.admin.certificates.notifications.updateSuccess);
		} catch (error) {
			console.error('Failed to update certificate alt texts:', error);
			toast.error(t.admin.certificates.notifications.updateError);
		} finally {
			savingAltsId = null;
		}
	}

	/* ------------------------------ add and delete ----------------------------- */

	async function handleImageSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		// Selecting the same file again should re-trigger `change`.
		input.value = '';

		if (!file) {
			return;
		}

		if (!IMAGE_MIME_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
			toast.error(t.admin.certificates.fields.image.invalidFile);
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

			// A replaced or abandoned upload is not deleted here - the bucket
			// sweep picks up whatever never gets attached to a certificate.
			newImageId = id;
			newImageUrl = url;
		} catch (error) {
			console.error('Failed to upload certificate image:', error);
			toast.error(t.admin.certificates.fields.image.uploadError);
		} finally {
			isUploadingImage = false;
		}
	}

	async function handleAdd(event: SubmitEvent) {
		event.preventDefault();

		if (!newImageId) {
			return;
		}

		isAdding = true;

		try {
			const created = await createCertificate({
				imageId: newImageId,
				alts: LOCALES.map((locale) => ({ lang: locale, text: newAlts[locale] ?? '' }))
			});

			certificates = [...certificates, created];
			altDrafts[created.id] = { ...created.altTexts };
			newImageId = '';
			newImageUrl = '';
			newAlts = {};
			toast.success(t.admin.certificates.notifications.createSuccess);
		} catch (error) {
			console.error('Failed to create certificate:', error);
			toast.error(t.admin.certificates.notifications.createError);
		} finally {
			isAdding = false;
		}
	}

	async function handleDelete(id: string) {
		deletingId = id;

		try {
			await deleteCertificate({ id });
			certificates = certificates.filter((certificate) => certificate.id !== id);
			toast.success(t.admin.certificates.notifications.deleteSuccess);
		} catch (error) {
			console.error('Failed to delete certificate:', error);
			toast.error(t.admin.certificates.notifications.deleteError);
		} finally {
			deletingId = null;
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={path('/admin')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<span>
			<i class="fa-solid fa-arrow-left mr-2"></i>
		</span>
		{t.admin.certificates.back}
	</a>
</div>

<!-- New certificates join at the end of the gallery - drag them into place. -->
<form onsubmit={handleAdd} class="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
	<h2 class="mb-4 text-xl font-semibold tracking-tight">{t.admin.certificates.add.title}</h2>

	<div class="flex flex-wrap items-start gap-6">
		<div>
			{#if newImageUrl}
				<img
					src={newImageUrl}
					alt={t.admin.certificates.fields.image.label}
					class="mb-3 h-40 w-64 rounded-md border border-gray-200 object-contain"
				/>
			{/if}

			<label
				class={`inline-block cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${isUploadingImage ? 'pointer-events-none opacity-70' : ''}`}
			>
				<span>
					<i
						class={`${isUploadingImage ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-image'} mr-2`}
					></i>
				</span>
				{newImageId
					? t.admin.certificates.fields.image.replace
					: t.admin.certificates.fields.image.upload}
				<input
					type="file"
					accept={IMAGE_MIME_TYPES.join(',')}
					class="hidden"
					disabled={isUploadingImage}
					onchange={handleImageSelected}
				/>
			</label>
		</div>

		<div class="min-w-64 flex-1 space-y-4">
			{#each LOCALES as locale (locale)}
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700" for={`new-alt-${locale}`}>
						{t.admin.certificates.fields.alt.label({ language: localeTabLabel(locale) })}
					</label>
					<input
						id={`new-alt-${locale}`}
						type="text"
						maxlength="250"
						bind:value={newAlts[locale]}
						placeholder={t.admin.certificates.fields.alt.placeholder}
						class="w-full rounded-md border border-gray-300 focus:border-gray-500"
					/>
				</div>
			{/each}
			<small class="block text-xs text-gray-500">{t.admin.certificates.fields.alt.hint}</small>
		</div>
	</div>

	<div class="mt-4 flex justify-end">
		<button
			type="submit"
			class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
			disabled={!newImageId || isAdding || isUploadingImage}
		>
			{#if isAdding}
				<span><i class="fa-solid fa-spinner fa-spin mr-2"></i></span>
				{t.admin.certificates.add.submitLoading}
			{:else}
				<span><i class="fa-solid fa-plus mr-2"></i></span>
				{t.admin.certificates.add.submit}
			{/if}
		</button>
	</div>
</form>

{#if isLoading}
	<div class="flex items-center justify-center py-12">
		<LoadingSpinner size="lg" />
	</div>
{:else if loadError}
	<ErrorNotice error={loadError} reset={load} />
{:else if certificates.length === 0}
	<div class="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
		<span>
			<i class="fa-solid fa-inbox mb-4 text-5xl text-gray-400"></i>
		</span>
		<h3 class="mb-2 text-xl font-semibold text-gray-700">
			{t.admin.certificates.emptyState.title}
		</h3>
		<p class="text-gray-500">{t.admin.certificates.emptyState.description}</p>
	</div>
{:else}
	<p class="mb-3 text-sm text-gray-500">
		<span><i class="fa-solid fa-up-down mr-1"></i></span>
		{t.admin.certificates.reorderHint}
	</p>

	<div class="space-y-4" role="list">
		{#each certificates as certificate, index (certificate.id)}
			<article
				role="listitem"
				draggable="true"
				ondragstart={(event) => handleDragStart(event, certificate.id)}
				ondragover={(event) => handleDragOver(event, certificate.id)}
				ondragend={handleDragEnd}
				class={`rounded-lg border bg-white p-4 shadow-sm transition-shadow ${
					draggedId === certificate.id ? 'border-blue-400 opacity-70 shadow-md' : 'border-gray-200'
				}`}
			>
				<div class="flex flex-wrap items-start gap-4">
					<div class="flex items-center gap-3 self-stretch">
						<span class="cursor-grab text-gray-400" title={t.admin.certificates.reorderHint}>
							<i class="fa-solid fa-grip-vertical"></i>
						</span>

						<span class="w-8 text-center text-lg font-bold text-gray-500">
							{index + 1}
						</span>

						<div class="flex flex-col gap-1">
							<button
								type="button"
								class="cursor-pointer rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
								aria-label={t.admin.certificates.actions.moveUp}
								disabled={index === 0}
								onclick={() => handleMove(index, -1)}
							>
								<i class="fa-solid fa-chevron-up"></i>
							</button>
							<button
								type="button"
								class="cursor-pointer rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
								aria-label={t.admin.certificates.actions.moveDown}
								disabled={index === certificates.length - 1}
								onclick={() => handleMove(index, 1)}
							>
								<i class="fa-solid fa-chevron-down"></i>
							</button>
						</div>
					</div>

					<img
						src={certificate.imageUrl}
						alt={certificate.altTexts['pl-PL'] ??
							t.admin.certificates.position({ position: index + 1 })}
						class="h-28 w-40 rounded-md border border-gray-200 bg-gray-50 object-contain"
						loading="lazy"
					/>

					<div class="min-w-64 flex-1 space-y-3">
						{#each LOCALES as locale (locale)}
							<div>
								<label
									class="mb-1 block text-xs font-medium text-gray-600"
									for={`alt-${certificate.id}-${locale}`}
								>
									{t.admin.certificates.fields.alt.label({ language: localeTabLabel(locale) })}
								</label>
								<input
									id={`alt-${certificate.id}-${locale}`}
									type="text"
									maxlength="250"
									bind:value={altDrafts[certificate.id][locale]}
									placeholder={t.admin.certificates.fields.alt.placeholder}
									class="w-full rounded-md border border-gray-300 text-sm focus:border-gray-500"
								/>
							</div>
						{/each}
					</div>

					<div class="flex flex-col items-stretch gap-2">
						<button
							type="button"
							class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={!altsDirty(certificate) || savingAltsId === certificate.id}
							onclick={() => handleSaveAlts(certificate)}
						>
							{#if savingAltsId === certificate.id}
								<span><i class="fa-solid fa-spinner fa-spin mr-2"></i></span>
							{:else}
								<span><i class="fa-solid fa-save mr-2"></i></span>
							{/if}
							{t.admin.certificates.actions.saveAlts}
						</button>

						<AdminDeleteDialog
							itemName={t.admin.certificates.position({ position: index + 1 })}
							labels={t.admin.certificates.deleteDialog}
							triggerLabel={t.admin.certificates.actions.delete}
							isDeleting={deletingId === certificate.id}
							onConfirm={() => handleDelete(certificate.id)}
						/>
					</div>
				</div>
			</article>
		{/each}
	</div>
{/if}
