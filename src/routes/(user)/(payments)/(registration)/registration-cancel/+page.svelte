<script lang="ts">
	import { resolve } from '$app/paths';
	import { PaymentResultPage } from '$lib';
</script>

<PaymentResultPage
	type="cancel"
	translationPrefix="user.pages.registrations.checkoutMessages"
	redirectPath={resolve('/(user)/registrations')}
	buttonTextKey="backToRegistrations"
	redirectDelay={10}
/>
