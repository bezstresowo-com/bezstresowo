<script lang="ts">
	import { getLocale, Locale, path, t } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
	import { trackMetaStandardEvent } from '$lib/Tracking/meta-events';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		// Remove the Stripe session identifier before the Meta Pixel can load.
		const cleanUrl = new URL(window.location.href);
		cleanUrl.searchParams.delete('session_id');
		window.history.replaceState(window.history.state, '', cleanUrl);
		if (!data.paidConsultation || !data.sessionId) return;
		// The Pixel loads only after the visitor opts in to optional marketing cookies.
		if (localStorage.getItem('bezstresowo:marketing-consent:v1') !== 'granted') return;
		const key = `bezstresowo:tracked-schedule:${data.sessionId}`;
		if (sessionStorage.getItem(key)) return;
		// Defer until the layout Pixel listener has mounted.
		const timeout = setTimeout(() => {
			trackMetaStandardEvent('Schedule');
			sessionStorage.setItem(key, '1');
		}, 0);
		return () => clearTimeout(timeout);
	});
</script>

<Seo title={t.meta.paymentSuccess.title} description={t.meta.paymentSuccess.description} noindex />

{#if data.paidConsultation}
	<PaymentResultPage
		type="success"
		labels={t.user.pages.registrations.checkoutMessages}
		buttonText={t.user.pages.registrations.checkoutMessages.backToRegistrations}
		redirectPath={path('/registrations')}
		redirectDelay={5}
	/>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="mx-auto max-w-md rounded-lg p-8 text-center shadow-lg">
			<h1 class="mb-2 text-2xl font-bold text-primary">
				{getLocale() === Locale.ukUA
					? 'Не вдалося підтвердити оплату'
					: 'Nie udało się potwierdzić płatności'}
			</h1>
			<p class="text-primary">
				{getLocale() === Locale.ukUA
					? 'Ця сторінка не підтверджує оплату консультації. Якщо ви вже оплатили її, зв’яжіться з нами.'
					: 'Ta strona nie potwierdza opłacenia konsultacji. Jeśli płatność została już wykonana, skontaktuj się z nami.'}
			</p>
			<a class="mt-6 inline-block font-medium text-primary underline" href={path('/registrations')}>
				{t.user.pages.registrations.checkoutMessages.backToRegistrations}
			</a>
		</div>
	</div>
{/if}
