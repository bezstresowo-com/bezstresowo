<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';

	const translationPrefix = 'user.pages.shop.paymentSuccess';

	onMount(() => {
		const timer = setTimeout(() => {
			goto(resolve('/(user)/shop'));
		}, 5000);

		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>{$translate(`${translationPrefix}.title`)}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
		<div class="mb-6">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
				<i class="fa-solid fa-check text-3xl text-green-600"></i>
			</div>
			<h1 class="mb-2 text-2xl font-bold text-gray-900">
				{$translate(`${translationPrefix}.title`)}
			</h1>
			<p class="text-gray-600">
				{$translate(`${translationPrefix}.message`)}
			</p>
		</div>

		<div class="space-y-3">
			<Button
				href={resolve('/(user)/shop')}
				tailwind="w-full"
			>
				{$translate(`${translationPrefix}.backToShop`)}
			</Button>

			<p class="text-sm text-gray-500">
				{$translate(`${translationPrefix}.autoRedirect`)}
			</p>
		</div>
	</div>
</div>
