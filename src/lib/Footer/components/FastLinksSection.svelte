<script lang="ts">
	import { path, t } from '$i18n';
	import { FAST_LINKS } from '../model';
</script>

<div class="flex flex-col">
	<div class="mb-3 text-secondary">{t.user.footer.fastLinksHeader}</div>
	{#each FAST_LINKS as { id, name, path: target } (id)}
		{@const href = path(target)}
		<a {href} class="mb-3 font-thin text-white">
			{t.user.footer.fastLinks[name]}
		</a>
	{/each}
</div>
