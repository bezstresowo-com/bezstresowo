<script lang="ts">
	import { resolve } from '$app/paths';
	import { PaymentResultPage } from '$lib';
</script>

<PaymentResultPage
	type="success"
	translationPrefix="user.pages.registrations.checkoutMessages"
	redirectPath={resolve('/(user)/registrations')}
	buttonTextKey="backToRegistrations"
	redirectDelay={5}
/>
