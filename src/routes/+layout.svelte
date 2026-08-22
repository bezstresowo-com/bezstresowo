<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-sonner';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	let { children } = $props();
</script>

<!--
	The active language comes from the `[lang]` segment of the URL, so there is
	no locale store to hydrate here - see `$i18n`.
-->
<Toaster position="bottom-right" />

{@render children?.()}
