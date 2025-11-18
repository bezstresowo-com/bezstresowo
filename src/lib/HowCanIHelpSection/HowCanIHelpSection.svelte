<script lang="ts">
	import { translate } from '$i18n';
	import { HELP_ELEMENTS } from './model';
</script>

<section class="bg-white pt-12 text-primary max-xl:px-4">
	<div class="mx-auto pb-8 text-center">
		<h1 class="text-3xl font-semibold sm:text-4xl">
			{$translate('user.pages.home.howCanIHelp.title')}
		</h1>
	</div>
	<div class="mx-auto flex gap-3 max-md:flex-col">
		{#each HELP_ELEMENTS as { icon, title }, i (i)}
			<div
				class="flex w-auto flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-accent p-6 text-center"
			>
				<i class={`text-[48px] text-accent ${icon}`}></i>
				<h3 class="element-title">{$translate(title)}</h3>
			</div>
		{/each}
	</div>
</section>
