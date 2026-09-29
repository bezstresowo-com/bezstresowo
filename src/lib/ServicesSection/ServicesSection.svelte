<script lang="ts">
	import { path, t, translateKey } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import { OFFERED_SERVICES } from './model';
</script>

<section id="services" class="scroll-mt-24 bg-white pt-12 text-primary max-2xl:px-4">
	<div class="pb-8 text-center">
		<h2 class="text-3xl font-semibold sm:text-4xl">
			{t.user.pages.home.offeredServices.title}
		</h2>
	</div>

	<div class="grid grid-cols-2 gap-5 max-md:flex max-md:flex-col">
		{#each OFFERED_SERVICES as { prefix, icon, slug } (slug)}
			<div class="flex flex-1 flex-col gap-7 rounded-lg border border-accent p-10 text-left">
				<span class="flex items-center gap-6">
					<i class={`text-4xl text-accent ${icon}`}></i>
					<h3 class="font-bold">{translateKey(`${prefix}.title`)}</h3>
				</span>
				<p>{translateKey(`${prefix}.description`)}</p>
				<span class="flex-auto"></span>
				<Button
					href={path(`/${slug}`)}
					tailwind="inline-flex w-full items-center justify-center border border-accent bg-white px-5"
				>
					{t.user.pages.home.offeredServices.learnMore}
					<i class="fa-solid fa-arrow-right ml-2 text-sm" aria-hidden="true"></i>
				</Button>
			</div>
		{/each}
	</div>
</section>
