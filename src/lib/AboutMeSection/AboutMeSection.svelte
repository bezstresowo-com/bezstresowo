<script lang="ts">
	import { translate } from '$i18n';
	import { asset } from '$app/paths';

	const descriptionParts = Array.from({ length: 5 }).map(
		(_, i) => `user.pages.home.aboutMe.description.${i}`
	);
</script>

<section class="pt-20 max-xl:px-4">
	<div class="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-7">
		<div class="col-span-3 flex justify-center">
			<img src={asset('assets/about-me.jpg')} alt="About Me" class="rounded-lg object-cover" />
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
