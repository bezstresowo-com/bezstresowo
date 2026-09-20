<script lang="ts">
	import { t } from '$i18n';
	import { openCookieSettings } from '$lib/Tracking/meta-events';
	import { getSiteSettings } from '$remote/site-settings.remote';
	import ContactSection from './components/ContactSection.svelte';
	import FastLinksSection from './components/FastLinksSection.svelte';
	import FollowMeSection from './components/FollowMeSection.svelte';

	const settings = $derived(getSiteSettings());
</script>

<footer class="bg-primary px-5 py-6">
	<svelte:boundary>
		{#snippet pending()}
			<div class="h-24 border-b-1 border-white/30"></div>
		{/snippet}

		{@const current = await settings}
		<div class="grid grid-cols-3 border-b-1 border-white/30 pb-6 max-md:flex max-md:flex-col">
			<ContactSection settings={current} />
			<FastLinksSection />
			<FollowMeSection settings={current} />
		</div>
	</svelte:boundary>
	<div class="flex flex-col items-center gap-2 py-4 text-center font-thin text-white">
		<div>{t.user.footer.copyright({ year: new Date(Date.now()).getFullYear() })}</div>
		<button
			type="button"
			onclick={openCookieSettings}
			class="text-sm text-white/80 underline underline-offset-4 transition hover:text-secondary"
		>
			{t.user.footer.cookieSettings}
		</button>
	</div>
</footer>
