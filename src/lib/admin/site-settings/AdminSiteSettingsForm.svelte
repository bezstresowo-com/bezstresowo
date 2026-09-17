<script lang="ts">
	import { path, t } from '$i18n';
	import type { UpdateSiteSettingsDto } from '$remote/dto/site-settings';
	import type { PublicSiteSettings } from '$shared/global/config/site-settings';
	import { untrack } from 'svelte';

	interface Props {
		settings: PublicSiteSettings;
		onSubmit: (dto: UpdateSiteSettingsDto) => Promise<boolean>;
	}

	let { settings, onSubmit }: Props = $props();
	let draft = $state<PublicSiteSettings>(untrack(() => ({ ...settings })));
	let isSubmitting = $state(false);

	const contactFields = ['phone', 'email', 'locationPl', 'locationUk'] as const;
	const hoursFields = ['hoursWeek', 'hoursSaturday'] as const;
	const socialFields = [
		'facebookUrl',
		'instagramPlUrl',
		'instagramUkUrl',
		'telegramUkUrl'
	] as const;

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;

		try {
			await onSubmit({ ...draft });
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
		<h2 class="text-xl font-semibold">{t.admin.siteSettings.sections.contact}</h2>
		<div class="mt-4 grid gap-4 md:grid-cols-2">
			{#each contactFields as field (field)}
				<label class="block text-sm font-medium text-gray-700">
					<span class="mb-1 block">{t.admin.siteSettings.fields[field]}</span>
					<input
						type={field === 'email' ? 'email' : 'text'}
						bind:value={draft[field]}
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</label>
			{/each}
		</div>
	</section>

	<section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
		<h2 class="text-xl font-semibold">{t.admin.siteSettings.sections.hours}</h2>
		<p class="mt-1 text-sm text-gray-500">{t.admin.siteSettings.hoursHint}</p>
		<div class="mt-4 grid gap-4 md:grid-cols-2">
			{#each hoursFields as field (field)}
				<label class="block text-sm font-medium text-gray-700">
					<span class="mb-1 block">{t.admin.siteSettings.fields[field]}</span>
					<input
						type="text"
						bind:value={draft[field]}
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</label>
			{/each}
		</div>
	</section>

	<section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
		<h2 class="text-xl font-semibold">{t.admin.siteSettings.sections.social}</h2>
		<p class="mt-1 text-sm text-gray-500">{t.admin.siteSettings.socialHint}</p>
		<div class="mt-4 grid gap-4">
			{#each socialFields as field (field)}
				<label class="block text-sm font-medium text-gray-700">
					<span class="mb-1 block">{t.admin.siteSettings.fields[field]}</span>
					<input
						type="url"
						bind:value={draft[field]}
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</label>
			{/each}
		</div>
	</section>

	<div class="flex justify-end gap-3">
		<a
			href={path('/admin')}
			class="rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
		>
			{t.admin.siteSettings.cancel}
		</a>
		<button
			type="submit"
			disabled={isSubmitting}
			class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
		>
			{isSubmitting ? t.admin.siteSettings.submitLoading : t.admin.siteSettings.submit}
		</button>
	</div>
</form>
