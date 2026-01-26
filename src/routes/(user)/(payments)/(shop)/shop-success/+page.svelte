<script lang="ts">
	import { resolve } from '$app/paths';
	import { PaymentResultPage } from '$lib';
</script>

<PaymentResultPage
	type="success"
	translationPrefix="user.pages.shop.checkoutMessages"
	redirectPath={resolve('/(user)/shop')}
	buttonTextKey="backToShop"
	redirectDelay={5}
/>
