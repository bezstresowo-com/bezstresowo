<script lang="ts">
	import { CONTACT_ELEMENTS, FAST_LINKS, FOLLOW_ME_LINKS } from './model';
	import { translate } from '$i18n';
	import ContactSection from './components/ContactSection.svelte';
	import FastLinksSection from './components/FastLinksSection.svelte';
	import FollowMeSection from './components/FollowMeSection.svelte';
</script>

<footer class="bg-primary px-5 py-6">
	<div class="grid grid-cols-3 border-b-1 border-white/30 pb-6 max-md:flex max-md:flex-col">
		<ContactSection />
		<FastLinksSection />
		<FollowMeSection />
	</div>
	<div class="py-4 text-center font-thin text-white">
		{$translate('user.footer.copyright')}
	</div>
</footer>
