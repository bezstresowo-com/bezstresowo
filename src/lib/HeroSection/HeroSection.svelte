<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/Button/Button.svelte';
	import { t } from '$i18n';

	const heroSrcset = `${asset('/assets/hero-640.webp')} 640w, ${asset('/assets/hero-1280.webp')} 1280w`;
	const heroSizes = '(min-width: 1280px) 1280px, 100vw';
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		href={asset('/assets/hero-1280.webp')}
		imagesrcset={heroSrcset}
		imagesizes={heroSizes}
		fetchpriority="high"
	/>
</svelte:head>

<div class="relative h-96">
	<img
		src={asset('/assets/hero-1280.webp')}
		srcset={heroSrcset}
		sizes={heroSizes}
		width="1280"
		height="593"
		alt=""
		loading="eager"
		fetchpriority="high"
		decoding="async"
		class="absolute inset-0 h-full w-full object-cover object-center"
	/>
	<div class="absolute right-0 bottom-4 left-0 flex justify-center">
		<div class="flex flex-col items-center justify-center rounded-lg bg-white/75 p-4 text-primary">
			<h1 class="text-center text-xl font-bold">
				{t.user.pages.home.hero.primary}
			</h1>
			<Button tailwind="w-auto mt-3 p-3" href="#contact">
				{t.user.pages.home.hero.contactMe}
			</Button>
		</div>
	</div>
</div>
