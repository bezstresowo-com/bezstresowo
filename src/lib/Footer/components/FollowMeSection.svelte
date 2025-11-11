<script lang="ts">
	import { translate } from '$i18n';
	import { FOLLOW_ME_LINKS } from '../model';
</script>

<div>
	<div class="mb-3 text-secondary">{$translate('user.footer.followMeHeader')}</div>
	<div class="flex gap-3">
		{#each FOLLOW_ME_LINKS as { icon, label, href } (href)}
			<a
				{href}
				aria-label={label}
				class="flex size-[30px] items-center justify-center rounded-full bg-accent transition hover:bg-accent/80"
			>
				<i class="fa-brands text-xl text-primary {icon}"></i>
			</a>
		{/each}
	</div>
</div>
