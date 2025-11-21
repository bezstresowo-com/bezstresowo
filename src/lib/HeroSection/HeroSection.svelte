<script lang="ts">
	import { asset } from '$app/paths';
	import Button from '$lib/Button/Button.svelte';
	import { translate } from '$i18n';
</script>

<div
	class="flex h-96 flex-col items-center justify-center bg-cover bg-center text-primary"
	style={`background-image: url(${asset('assets/hero-image.jpg')});`}
>
	<div class="text-center text-5xl text-balance">{$translate('user.pages.home.hero.primary')}</div>
	<div class="mt-3 text-center text-xl">{$translate('user.pages.home.hero.secondary')}</div>
	<Button tailwind="w-auto mt-3 p-3" href="#contact"
		>{$translate('user.pages.home.hero.contactMe')}</Button
	>
</div>
