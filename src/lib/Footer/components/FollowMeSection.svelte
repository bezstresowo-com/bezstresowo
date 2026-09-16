<script lang="ts">
	import { getLocale, t } from '$i18n';
	import { FOLLOW_ME_LINKS } from '../model';

	const links = $derived(
		FOLLOW_ME_LINKS.filter(({ locales }) => locales.some((locale) => locale === getLocale()))
	);
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
