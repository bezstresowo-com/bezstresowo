<script lang="ts">
	import { path, t } from '$i18n';
	import AdminBioForm from '$lib/admin/bio/AdminBioForm/AdminBioForm.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import { getAdminBio, updateBio } from '$remote/admin-bio.remote';
	import type { UpsertBioDto } from '$remote/dto/bio';
	import { toast } from 'svelte-sonner';

	const bio = $derived(getAdminBio());

	async function handleSave(dto: UpsertBioDto) {
		try {
			await updateBio(dto);
			toast.success(t.admin.bio.notifications.updateSuccess);
			// Stay on the page - the singleton has no list to go back to.
			await getAdminBio().refresh();
			return true;
		} catch (error) {
			console.error('Failed to update bio:', error);
			toast.error(t.admin.bio.notifications.updateError);
			return false;
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
		{t.admin.bio.back}
	</a>
</div>

<svelte:boundary>
	{#snippet pending()}
		<div class="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 h-6 w-1/2 rounded bg-gray-200"></div>
			<div class="mb-2 h-4 w-full rounded bg-gray-100"></div>
			<div class="h-64 w-full rounded bg-gray-100"></div>
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<ErrorNotice {error} {reset} />
	{/snippet}

	{@const existing = await bio}

	<AdminBioForm bio={existing} onSubmit={handleSave} />
</svelte:boundary>
