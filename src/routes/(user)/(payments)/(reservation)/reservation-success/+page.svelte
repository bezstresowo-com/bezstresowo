<script lang="ts">
	import { resolve } from '$app/paths';
	import { PaymentResultPage } from '$lib';
</script>

<PaymentResultPage
	type="success"
	translationPrefix="user.pages.reservations.checkoutMessages"
	redirectPath={resolve('/(user)/reservations')}
	buttonTextKey="backToReservations"
	redirectDelay={5}
/>
