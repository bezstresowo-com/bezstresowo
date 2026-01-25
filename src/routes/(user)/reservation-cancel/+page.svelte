<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';

	const translationPrefix = 'user.pages.reservations.checkoutMessages';
	let timeLeft = 10;

	$: redirectMessage = $translate(`${translationPrefix}.autoRedirect`, { time: timeLeft });

	onMount(() => {
		const interval = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				clearInterval(interval);
				goto(resolve('/(user)/reservations'));
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{$translate(`${translationPrefix}.cancelTitle`)}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center">
	<div class="mx-auto max-w-md rounded-lg p-8 text-center shadow-lg">
		<div class="mb-6">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary"
			>
				<i class="fa-solid fa-exclamation-triangle text-3xl text-accent"></i>
			</div>
			<h1 class="mb-2 text-2xl font-bold text-primary">
				{$translate(`${translationPrefix}.cancelTitle`)}
			</h1>
			<p class="text-primary">
				{$translate(`${translationPrefix}.cancelDescription`)}
			</p>
		</div>
		<Button href={resolve('/(user)/reservations')} tailwind="p-2">
			{$translate(`${translationPrefix}.backToReservations`)}
		</Button>

		<p class="mt-4 text-sm text-primary/70">
			{redirectMessage}
		</p>
	</div>
</div>
