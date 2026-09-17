<script lang="ts">
	import { path, t } from '$i18n';
	import AdminSiteSettingsForm from '$lib/admin/site-settings/AdminSiteSettingsForm.svelte';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import { getAdminSiteSettings, updateSiteSettings } from '$remote/admin-site-settings.remote';
	import type { UpdateSiteSettingsDto } from '$remote/dto/site-settings';
	import { toast } from 'svelte-sonner';

	const settings = $derived(getAdminSiteSettings());

	async function handleSave(dto: UpdateSiteSettingsDto) {
		try {
			await updateSiteSettings(dto);
			await getAdminSiteSettings().refresh();
			toast.success(t.admin.siteSettings.notifications.updateSuccess);
			return true;
		} catch (error) {
			console.error('Failed to update site settings:', error);
			toast.error(t.admin.siteSettings.notifications.updateError);
			return false;
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<a
		href={path('/admin')}
		class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
	>
		<i class="fa-solid fa-arrow-left mr-2"></i>
		{t.admin.siteSettings.back}
	</a>
</div>

<div class="mb-5">
	<h1 class="text-3xl font-bold text-gray-800">{t.admin.siteSettings.title}</h1>
	<p class="mt-2 text-gray-600">{t.admin.siteSettings.intro}</p>
</div>

<svelte:boundary>
	{#snippet pending()}
		<div class="h-80 animate-pulse rounded-lg bg-gray-100"></div>
	{/snippet}

	{#snippet failed(error, reset)}
		<ErrorNotice {error} {reset} />
	{/snippet}

	{@const existing = await settings}
	<AdminSiteSettingsForm settings={existing} onSubmit={handleSave} />
</svelte:boundary>
