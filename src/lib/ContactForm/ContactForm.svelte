<!-- TODO: @Vyvr - use yup and craeteFormSvelte to create a form, use bits-ui whenever needed (probably not) glhf -->
<script lang="ts">
	import type { ContactRequestDto } from '$api/contact/model';
	import { resolve } from '$app/paths';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

const ENDPOINT_PATH = resolve('/api/contact');

const prefix = 'contactForm.form';

</script>

<div>
	<p>Hello World</p>
</div>
