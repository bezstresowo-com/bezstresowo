<script lang="ts">
	import { resolve } from '$app/paths';
	import { PaymentResultPage } from '$lib';
</script>

<PaymentResultPage
	type="cancel"
	translationPrefix="user.pages.shop.checkoutMessages"
	redirectPath={resolve('/(user)/shop')}
	buttonTextKey="backToShop"
	redirectDelay={10}
/>
