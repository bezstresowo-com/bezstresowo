<script lang="ts">
	import { t } from '$i18n';
	import { HELP_ELEMENTS } from './model';
</script>

<section class="bg-white pt-12 text-primary max-2xl:px-4">
	<div class="mx-auto pb-8 text-center">
		<h1 class="text-3xl font-semibold sm:text-4xl">
			{t.user.pages.home.howCanIHelp.title}
		</h1>
	</div>
	<div class="mx-auto flex gap-3 max-md:flex-col">
		{#each HELP_ELEMENTS as { icon, name }, i (i)}
			<div
				class="flex w-auto flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-accent p-6 text-center"
			>
				<i class={`text-5xl text-accent ${icon}`}></i>
				<h3 class="element-title">{t.user.pages.home.howCanIHelp.elements[name]}</h3>
			</div>
		{/each}
	</div>
</section>
