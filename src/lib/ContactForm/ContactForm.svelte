<script lang="ts">
	import { resolve } from '$app/paths';
	import { createForm } from 'svelte-forms-lib';
	import { FORM_FIELDS, FORM_FIELDS_ORDER, FORM_INITIAL_VALUE, SCHEMA } from './model';
	import { getBaseHeaders } from '$shared/global/functions/get-base-headers';
	import { HttpStatus } from '$shared/global/enums/http-status';
	import type { HttpErrorResponse } from '$shared/global/types/http';
	import { translate } from '$i18n';
	import type { ContactRequestDto } from '$api/contact/model';
	import { HttpMethod } from '$shared/global/enums/http-method';

	let isLoading = $state(false);
	let generalError = $state<string | null>(null);

	const {
		form,
		errors,
		touched,
		state: formState,
		handleChange,
		handleSubmit,
		handleReset
	} = createForm({
		initialValues: FORM_INITIAL_VALUE,
		validationSchema: SCHEMA,
		async onSubmit({ email, message, name, phone, subject, surname }) {
			isLoading = true;
			try {
				const body = JSON.stringify({
					email,
					tel: phone,
					name,
					subject,
					surname,
					message
				} satisfies ContactRequestDto);

				const response = await fetch(resolve('/api/contact'), {
					method: HttpMethod.POST,
					headers: getBaseHeaders(),
					body
				});

				switch (response.status) {
					case HttpStatus.OK:
						generalError = null;
						handleReset();
						break;

					case HttpStatus.BAD_REQUEST:
						console.log({ response });
						break;

					case HttpStatus.INTERNAL_SERVER_ERROR:
						console.log({ response });
						break;
				}
			} catch (error) {
				console.log(`General fetch error: ${(error as Error).message}`);
			} finally {
				isLoading = false;
			}
		}
	});
</script>

<form onsubmit={handleSubmit}>
	<div class="text-lg font-bold">{$translate('user.contactForm.title')}</div>

	{#each FORM_FIELDS_ORDER as key, i (i + key)}
		{#if FORM_FIELDS[key].element === 'input'}
			<div>
				<label for={key}>{$translate(`user.contactForm.fields.${key}.label`)}</label>
				<input
					id={key}
					name={key}
					type={FORM_FIELDS[key].type}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
				/>
			</div>
		{:else if FORM_FIELDS[key].element === 'textarea'}
			<div>
				<label for={key}>{$translate(`user.contactForm.fields.${key}.label`)}</label>
				<textarea
					id={key}
					name={key}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
				></textarea>
			</div>
		{/if}

		{#if $errors[key] && $touched[key]}
			<small class="text-sm text-red-500">{$translate($errors[key])}</small>
		{/if}
	{/each}

	{#if generalError}
		<small class="text-sm text-red-500">{$translate(generalError)}</small>
	{/if}

	<button type="submit" class="">{$translate('user.contactForm.submit')}</button>
</form>
