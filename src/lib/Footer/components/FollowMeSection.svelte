<script lang="ts">
	import { getLocale, t } from '$i18n';
	import type { PublicSiteSettings } from '$shared/global/config/site-settings';
	import { followMeLinks } from '../model';

	let { settings }: { settings: PublicSiteSettings } = $props();
	const links = $derived(followMeLinks(settings, getLocale()));
</script>

<div>
	<div class="mb-3 text-secondary">{t.user.footer.followMeHeader}</div>
	<div class="flex gap-3">
		{#each links as { icon, label, href } (href)}
			<a
				{href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={label}
				class="flex size-8 items-center justify-center rounded-full bg-accent transition hover:bg-accent/80"
			>
				<i class="fa-brands text-xl text-primary {icon}"></i>
			</a>
		{/each}
	</div>
</div>
