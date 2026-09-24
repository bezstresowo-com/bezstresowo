<script lang="ts">
	import { path, t } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
	import { trackMetaStandardEvent } from '$lib/Tracking/meta-events';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (!data.paidConsultation || !data.sessionId) return;
		// The Pixel loads only after the visitor opts in to optional marketing cookies.
		if (localStorage.getItem('bezstresowo:marketing-consent:v1') !== 'granted') return;
		const key = `bezstresowo:tracked-schedule:${data.sessionId}`;
		if (sessionStorage.getItem(key)) return;
		trackMetaStandardEvent('Schedule');
		sessionStorage.setItem(key, '1');
	});
</script>

<Seo title={t.meta.paymentSuccess.title} description={t.meta.paymentSuccess.description} noindex />

<PaymentResultPage
	type="success"
	labels={t.user.pages.registrations.checkoutMessages}
	buttonText={t.user.pages.registrations.checkoutMessages.backToRegistrations}
	redirectPath={path('/registrations')}
	redirectDelay={5}
/>
