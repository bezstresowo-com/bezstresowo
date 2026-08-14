<script lang="ts">
	import { path } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title="meta.paymentSuccess.title" description="meta.paymentSuccess.description" noindex />

<PaymentResultPage
	type="success"
	translationPrefix="user.pages.shop.checkoutMessages"
	redirectPath={path('/shop')}
	buttonTextKey="backToShop"
	redirectDelay={5}
/>
