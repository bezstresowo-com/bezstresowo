<script lang="ts">
	import { translate } from "$i18n";
	import { FAST_LINKS } from "../model";

</script>

<div class="flex flex-col">
	<div class="mb-3 text-secondary">{$translate('user.footer.fastLinksHeader')}</div>
	{#each FAST_LINKS as { label, href }}
		<a {href} class="mb-3 font-thin text-white">{$translate(label)}</a>
	{/each}
</div>
