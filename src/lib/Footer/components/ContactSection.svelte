<script lang="ts">
	import { translate } from '$i18n';
	import { isNil } from 'lodash-es';
	import { CONTACT_ELEMENTS } from '../model';
</script>

<div>
	<div class="mb-3 text-secondary">{$translate('user.footer.contactHeader')}</div>
	{#each CONTACT_ELEMENTS as { id, label, icon, href } (id)}
		<div class="mb-3 flex items-center space-x-4">
			<span><i class="text-accent {icon}"></i></span>
			{#if isNil(href)}
				<span class="font-thin text-white">{label}</span>
			{:else}
				<a class="font-thin text-white" {href}>{label}</a>
			{/if}
		</div>
	{/each}
</div>
