<script lang="ts">
	import { getLocale, t } from '$i18n';
	import ErrorNotice from '$lib/ErrorNotice/ErrorNotice.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { getBio } from '$remote/bio.remote';

	const bio = $derived(getBio({ lang: getLocale() }));
</script>

<section class="pt-12 max-2xl:px-4">
	<svelte:boundary>
		{#snippet pending()}
			<div class="flex items-center justify-center">
				<LoadingSpinner size="lg" tailwind="mt-5" />
			</div>
		{/snippet}

		{#snippet failed(error, reset)}
			<ErrorNotice {error} {reset} />
		{/snippet}

		{@const data = await bio}

		<!-- An unseeded database simply hides the section. -->
		{#if data}
			<div class="mx-auto gap-6 max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-7">
				{#if data.imageUrl}
					<div class="col-span-3 flex justify-center">
						<img
							src={data.imageUrl}
							alt={t.user.a11y.aboutMeAlt}
							class="rounded-lg object-cover max-lg:aspect-video"
							loading="lazy"
						/>
					</div>
				{/if}

				<div class="col-span-4">
					<h1 class="mb-5 text-3xl text-primary">{t.user.pages.home.aboutMe.title}</h1>
					<!-- TipTap HTML written in the panel - see `/admin/bio`. -->
					<div
						class="text-sm text-primary/80 [&_h1]:my-3 [&_h1]:text-2xl [&_h2]:my-2 [&_h2]:text-xl [&_h3]:my-2 [&_h3]:text-lg [&_li]:my-0 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
					>
						{@html data.content}
					</div>
				</div>
			</div>
		{/if}
	</svelte:boundary>
</section>
