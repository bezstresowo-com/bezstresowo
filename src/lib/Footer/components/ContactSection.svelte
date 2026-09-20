<script lang="ts">
	import { getLocale, t } from '$i18n';
	import { trackMetaStandardEvent } from '$lib/Tracking/meta-events';
	import type { PublicSiteSettings } from '$shared/global/config/site-settings';
	import { isNil } from 'lodash-es';
	import { contactElements } from '../model';

	let { settings }: { settings: PublicSiteSettings } = $props();
	const elements = $derived(contactElements(settings, getLocale()));
</script>

<div>
	<div class="mb-3 text-secondary">{t.user.footer.contactHeader}</div>
	{#each elements as { id, label, icon, href } (id)}
		<div class="mb-3 flex items-center space-x-4">
			<span><i class="text-accent {icon}"></i></span>
			{#if isNil(href)}
				<span class="font-thin text-white">{label}</span>
			{:else}
				<a class="font-thin text-white" {href} onclick={() => trackMetaStandardEvent('Contact')}
					>{label}</a
				>
			{/if}
		</div>
	{/each}
</div>
