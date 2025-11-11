<script lang="ts">
	import { translate } from '$i18n';
	import { CONTACT_ELEMENTS } from '../model';
</script>

<div>
	<div class="mb-3 text-secondary">{$translate('user.footer.contactHeader')}</div>
	{#each CONTACT_ELEMENTS as { id, label, icon } (id)}
		<div class="mb-3 flex items-center space-x-4">
			<span><i class="text-accent {icon}"></i></span>
			<span class="font-thin text-white">{label}</span>
		</div>
	{/each}
</div>
