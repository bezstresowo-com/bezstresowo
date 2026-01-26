<script lang="ts">
	import { resolve } from '$app/paths';
	import { PaymentResultPage } from '$lib';
</script>

<PaymentResultPage
	type="cancel"
	translationPrefix="user.pages.reservations.checkoutMessages"
	redirectPath={resolve('/(user)/reservations')}
	buttonTextKey="backToReservations"
	redirectDelay={10}
/>
