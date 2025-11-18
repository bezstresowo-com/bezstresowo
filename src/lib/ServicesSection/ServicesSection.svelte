<script lang="ts">
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import { OFFERED_SERVICES } from './model';
</script>

<section class="bg-white text-primary pt-20 max-xl:px-4">
	<div class="pb-8 text-center">
		<h1 class="text-3xl font-semibold sm:text-4xl">
			{$translate('user.pages.home.offeredServices.title')}
		</h1>
	</div>
	<div class="flex gap-5 max-md:flex-col">
		{#each OFFERED_SERVICES as { title, description, icon }, i(i)}
			<div
				class="flex flex-1 flex-col gap-7 rounded-lg border border-accent p-10 text-left"
			>
				<i class={`text-[48px] text-accent ${icon}`}></i>
				<h3 class="font-bold">{$translate(title)}</h3>
				<p>{$translate(description)}</p>
        <Button tailwind="w-full bg-white border border-accent">{$translate("user.pages.home.offeredServices.learnMore")}</Button>
			</div>
		{/each}
	</div>
</section>
