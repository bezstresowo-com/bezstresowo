<script lang="ts">
	import { path } from '$i18n';
	import { PaymentResultPage } from '$lib';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title="meta.paymentCancel.title" description="meta.paymentCancel.description" noindex />

<PaymentResultPage
	type="cancel"
	translationPrefix="user.pages.shop.checkoutMessages"
	redirectPath={path('/shop')}
	buttonTextKey="backToShop"
	redirectDelay={5}
/>
