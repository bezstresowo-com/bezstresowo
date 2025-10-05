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

        // @TODO: WIP - do konsultacji general errory itp.
        // if (response.ok) {
        //   generalError = null;
        //   handleReset();
        // } else {
        //   const errorResponse: HttpErrorResponse = await response.json();
        //   console.log(errorResponse[0].message);
        //   generalError = errorResponse.message;
        // }

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

<form
	onsubmit={handleSubmit}
	class="relative min-w-80 rounded-md border-2 border-primary bg-background px-8 py-6 text-primary shadow-md"
>
	<div class="text-2xl font-bold text-primary max-sm:text-xl">
		{$translate('user.contactForm.title')}
	</div>
	{#each FORM_FIELDS_ORDER as key, i (i + key)}
		{#if FORM_FIELDS[key].element === 'input'}
			<div class="relative my-6">
				<input
					id={key}
					name={key}
					type={FORM_FIELDS[key].type}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`user.contactForm.fields.${key}.label`)}
					class="peer w-full border-0 border-b-2 border-primary bg-background placeholder-transparent
                  focus:border-blue-600 focus:ring-0"
				/>
				<label
					for={key}
					class="absolute -top-4.5 left-0 text-sm text-gray-600 transition-all
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-4.5 peer-focus:text-sm peer-focus:text-blue-800"
					>{$translate(`user.contactForm.fields.${key}.label`)}</label
				>
				{#if $errors[key] && $touched[key]}
					<small class="text-sm text-danger">{$translate($errors[key])}</small>
				{/if}
			</div>
		{:else if FORM_FIELDS[key].element === 'textarea'}
			<div class="relative my-6">
				<textarea
					id={key}
					name={key}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`user.contactForm.fields.${key}.label`)}
					class="peer w-full border-0 border-b-2 border-primary bg-background placeholder-transparent
                  focus:border-blue-600 focus:ring-0"
				></textarea>
				<label
					for={key}
					class="absolute -top-4.5 left-0 text-sm text-gray-600 transition-all
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-4.5 peer-focus:text-sm peer-focus:text-blue-800"
					>{$translate(`user.contactForm.fields.${key}.label`)}</label
				>
				{#if $errors[key] && $touched[key]}
					<small class="text-sm text-danger">{$translate($errors[key])}</small>
				{/if}
			</div>
		{/if}
	{/each}

	{#if generalError}
		<small class="text-sm text-danger">{$translate(generalError)}</small>
	{/if}

	<button
		type="submit"
		disabled={!$formState.isValid || isLoading}
		class:grayscale={!$formState.isValid}
		class:cursor-not-allowed={!$formState.isValid || isLoading}
		class="bg-accent px-4 py-2 text-lg text-primary hover:bg-accent/70"
		>{$translate('user.contactForm.submit')}</button
	>
	{#if isLoading}
		<div role="status" class="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
			<svg
				aria-hidden="true"
				class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span class="sr-only">Loading...</span>
		</div>
	{/if}
</form>
