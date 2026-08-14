<script lang="ts">
	import { path } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title="meta.paymentCancel.title" description="meta.paymentCancel.description" noindex />

<PaymentResultPage
	type="cancel"
	translationPrefix="user.pages.registrations.checkoutMessages"
	redirectPath={path('/registrations')}
	buttonTextKey="backToRegistrations"
	redirectDelay={5}
/>
