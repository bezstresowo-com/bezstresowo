<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';

	const translationPrefix = 'user.pages.shop.checkoutMessages';
	let timeLeft = 5;

	$: redirectMessage = $translate(`${translationPrefix}.autoRedirect`, { time: timeLeft });

	onMount(() => {
		const interval = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				clearInterval(interval);
				goto(resolve('/(user)/shop'));
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{$translate(`${translationPrefix}.title`)}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center">
	<div class="mx-auto max-w-md rounded-lg p-8 text-center shadow-lg">
		<div class="mb-6">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-200"
			>
				<i class="fa-solid fa-check text-3xl text-success"></i>
			</div>
			<h1 class="mb-2 text-2xl font-bold text-primary">
				{$translate(`${translationPrefix}.successTitle`)}
			</h1>
			<p class="text-primary">
				{$translate(`${translationPrefix}.successDescription`)}
			</p>
		</div>
		<Button href={resolve('/(user)/shop')} tailwind="p-2">
			{$translate(`${translationPrefix}.backToShop`)}
		</Button>

		<p class="text-sm text-primary/70 mt-4">
			{redirectMessage}
		</p>
	</div>
</div>
