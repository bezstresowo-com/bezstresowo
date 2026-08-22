<script lang="ts">
	import { path, t } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title={t.meta.paymentSuccess.title} description={t.meta.paymentSuccess.description} noindex />

<PaymentResultPage
	type="success"
	labels={t.user.pages.registrations.checkoutMessages}
	buttonText={t.user.pages.registrations.checkoutMessages.backToRegistrations}
	redirectPath={path('/registrations')}
	redirectDelay={5}
/>
