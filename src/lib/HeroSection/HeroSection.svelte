<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/Button/Button.svelte';
	import { translate } from '$i18n';
</script>

<div
	class="relative h-96 bg-cover bg-center"
	style={`background-image: url(${asset('/assets/hero-image.jpg')});`}
>
	<div class="absolute right-0 bottom-4 left-0 flex justify-center">
		<div class="flex flex-col items-center justify-center rounded-lg bg-white/75 p-4 text-primary">
			<div class="text-center text-xl font-bold">
				{$translate('user.pages.home.hero.primary')}
			</div>
			<Button tailwind="w-auto mt-3 p-3" href="#contact">
				{$translate('user.pages.home.hero.contactMe')}
			</Button>
		</div>
	</div>
</div>
