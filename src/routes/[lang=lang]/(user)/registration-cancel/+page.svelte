<script lang="ts">
	import { path, t } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title={t.meta.paymentCancel.title} description={t.meta.paymentCancel.description} noindex />

<PaymentResultPage
	type="cancel"
	labels={t.user.pages.registrations.checkoutMessages}
	buttonText={t.user.pages.registrations.checkoutMessages.backToRegistrations}
	redirectPath={path('/registrations')}
	redirectDelay={5}
/>
