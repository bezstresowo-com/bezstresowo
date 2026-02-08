<script lang="ts">
	import { translate } from '$i18n';
	import { asset } from '$app/paths';

	const descriptionParts = Array.from({ length: 5 }).map(
		(_, i) => `user.pages.home.aboutMe.description.${i}`
	);
</script>

<section class="pt-12 max-xl:px-4">
	<div class="mx-auto gap-6 max-lg:flex max-lg:flex-col lg:grid lg:grid-cols-7">
		<div class="col-span-3 flex justify-center">
			<img
				src={asset('/assets/about-me.jpg')}
				alt="About Me"
				class="rounded-lg object-cover max-lg:aspect-video"
				loading="lazy"
			/>
		</div>

		<div class="col-span-4">
			<h1 class="mb-5 text-3xl text-primary">{$translate('user.pages.home.aboutMe.title')}</h1>
			<div class="text-sm text-primary/80">
				<p>{@html $translate('user.pages.home.aboutMe.myNameIs')}</p>
				{#each descriptionParts as descriptionPart, i (i)}
					<p class="my-2">{$translate(descriptionPart)}</p>
				{/each}
			</div>
		</div>
	</div>
</section>
