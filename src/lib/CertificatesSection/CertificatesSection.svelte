<script lang="ts">
	import { translate } from "$i18n";
	import { CERTIFICATES } from "./certificates";


</script>

<section class="bg-white text-primary pt-20 max-xl:px-4">
	<div class="mx-auto text-center">
		<h1 class="text-3xl font-semibold sm:text-4xl">
			{$translate('user.pages.home.certificates.title')}
		</h1>
	</div>
	<div class="mx-auto mt-6 flex gap-4 max-md:flex-col">
		{#each CERTIFICATES as { icon, title }}
			<div
				class="flex h-[170px] w-auto flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-accent p-6 text-center"
			>
				<i class={`text-[48px] text-accent ${icon}`}></i>
				<h3 class="element-title">{$translate(title)}</h3>
			</div>
		{/each}
	</div>
</section>