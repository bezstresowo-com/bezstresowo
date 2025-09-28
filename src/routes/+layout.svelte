<script lang="ts">
	import '../app.css';

	import { currentLocale, getUserPreferredLocale, Locale } from '$i18n';
	import { onDestroy, onMount } from 'svelte';
	import {
		localStorageGetItem,
		LocalStorageKey,
		localStorageSetItem
	} from '$shared/server/functions/local-storage';
	import { isNil } from 'lodash-es';
	import type { Unsubscriber } from 'svelte/store';

	let { children } = $props();

	const UNSUBS: Unsubscriber[] = [];

	onMount(() => {
		UNSUBS.push(
			currentLocale.subscribe((locale) => {
				localStorageSetItem(LocalStorageKey.locale, locale);
			})
		);

		let locale = localStorageGetItem(LocalStorageKey.locale);
		if (!Object.values(Locale).includes(locale as Locale)) {
			locale = null;
		}

		if (!isNil(locale)) {
			currentLocale.set(locale as Locale);
		} else {
			currentLocale.set(getUserPreferredLocale());
		}
	});

	onDestroy(() => {
		UNSUBS.forEach((unsub) => unsub());
	});
</script>

{@render children?.()}
