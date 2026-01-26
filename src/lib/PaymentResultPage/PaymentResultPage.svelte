<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { translate } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import type { Props } from './model';

	const {
		type,
		translationPrefix,
		redirectDelay = 5,
		redirectPath,
		buttonTextKey
	}: Props = $props();
	let timeLeft = $state(redirectDelay);
	const isSuccess = type === 'success';

	onMount(() => {
		const interval = setInterval(() => {
			timeLeft -= 1;
			if (timeLeft <= 0) {
				clearInterval(interval);
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(redirectPath);
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{$translate(`${translationPrefix}.${type}Title`)}</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center">
	<div class="mx-auto max-w-md rounded-lg p-8 text-center shadow-lg">
		<div class="mb-6">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full {isSuccess
					? 'bg-green-200'
					: 'bg-secondary'}"
			>
				<i
					class="fa-solid text-3xl {isSuccess
						? 'fa-check text-success'
						: 'fa-exclamation-triangle text-accent'}"
				></i>
			</div>
			<h1 class="mb-2 text-2xl font-bold text-primary">
				{$translate(`${translationPrefix}.${type}Title`)}
			</h1>
			<p class="text-primary">
				{$translate(`${translationPrefix}.${type}Description`)}
			</p>
		</div>
		<Button href={redirectPath} tailwind="p-2">
			{$translate(`${translationPrefix}.${buttonTextKey}`)}
		</Button>

		<p class="mt-4 text-sm text-primary/70">
			{$translate(`${translationPrefix}.autoRedirect`, { time: timeLeft })}
		</p>
	</div>
</div>
