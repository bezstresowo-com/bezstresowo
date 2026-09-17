<script lang="ts">
	import { t } from '$i18n';
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
	<div class="py-4 text-center font-thin text-white">
		{t.user.footer.copyright({ year: new Date(Date.now()).getFullYear() })}
	</div>
</footer>
