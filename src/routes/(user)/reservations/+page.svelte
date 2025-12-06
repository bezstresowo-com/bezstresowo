<script lang="ts">
	import type { ReservationsRequestDto } from '$api/reservations/model';
	import { resolve } from '$app/paths';
	import { translate } from '$i18n';
	import type { BackendErrorResponse } from '$lib/ContactForm/model';
	import { HttpMethod } from '$shared/global/enums/http-method';
	import { HttpStatus } from '$shared/global/enums/http-status';
	import { getBaseHeaders } from '$shared/global/functions/get-base-headers';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { createForm } from 'svelte-forms-lib';
	import {
		FIELD_MAP,
		FORM_FIELDS,
		FORM_FIELDS_ORDER,
		FORM_INITIAL_VALUE,
		prefix,
		SCHEMA,
		type FormValue
	} from './model';
	import { ButtonTypes } from '$lib/Button/model';
	import Button from '$lib/Button/Button.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';

	let isLoading = $state(false);
	let generalError = $state<string | null>(null);
		let isSubmitDisabled = $derived(() => {
			return isLoading || !$formState.isValid;
		});

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
		async onSubmit({ nameAndSurname, tel, email, checkInDate }) {
			isLoading = true;
			try {
				const body = JSON.stringify({
					nameAndSurname,
					tel,
					email,
					checkInDate
				} satisfies ReservationsRequestDto);

				const response = await fetch(resolve('/api/reservations'), {
					method: HttpMethod.POST,
					headers: getBaseHeaders(),
					body
				});

				const resBody: BackendErrorResponse = await response.json().catch(() => ({}));

				switch (response.status) {
					case HttpStatus.OK:
						generalError = null;
						handleReset();
						toast.success($translate(`${prefix}.toast.success`));
						break;

					case HttpStatus.BAD_REQUEST: {
						const serverErrors = resBody?.errors ?? [];
						if (serverErrors.length) {
							for (const { field, messages } of serverErrors) {
								const key = FIELD_MAP[field] ?? (field as keyof FormValue);
								const msg = messages?.[0];
								errors.update((e) => ({ ...e, [key]: msg }));
								touched.update((t) => ({ ...t, [key]: true }));
							}
						}
						break;
					}

					case HttpStatus.INTERNAL_SERVER_ERROR:
						toast.error($translate(`${prefix}.toast.error`));
						break;
				}
			} catch (error) {
				generalError = (error as Error).message;
				console.log(`General fetch error: ${(error as Error).message}`);
				toast.error($translate(`${prefix}.toast.error`));
			} finally {
				isLoading = false;
			}
		}
	});
</script>

<div class="h-full">
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90"
	>
		<div class="mx-auto text-center text-5xl text-white">{$translate(`${prefix}.title`)}</div>
		<div class="mx-auto mt-5 text-center text-secondary">
			{$translate(`${prefix}.titleDescription`)}
		</div>
	</div>

	<form onsubmit={handleSubmit} class="p-6 mt-10 mb-10 sm:pr-80 sm:pl-80 sm:mt-20">
		<div class="space-y-5">
			{#each FORM_FIELDS_ORDER as key, i (i + key)}
				{#if FORM_FIELDS[key].element === 'input'}
					<div>
						<label class="sr-only" for={key}>{$translate(`${prefix}.${key}.label`)}</label>
						<input
							id={key}
							name={key}
							type={FORM_FIELDS[key].type}
							bind:value={$form[key]}
							onchange={handleChange}
							onblur={handleChange}
							placeholder={$translate(`${prefix}.${key}.placeholder`)}
							class="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-800 placeholder-slate-400 transition outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
						/>

						{#if $errors[key] && $touched[key]}
							<small class="mt-1 block text-sm text-danger">{$translate($errors[key])}</small>
						{/if}
					</div>
				{:else if FORM_FIELDS[key].element === 'textarea'}
					<div>
						<label class="sr-only" for={key}> {$translate(`${prefix}.${key}.label`)}</label>
						<textarea
							id={key}
							name={key}
							rows="5"
							bind:value={$form[key]}
							onchange={handleChange}
							onblur={handleChange}
							placeholder={$translate(`${prefix}.${key}.placeholder`)}
							class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 transition outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
						></textarea>
						{#if $errors[key] && $touched[key]}
							<small class="mt-1 block text-sm text-danger">{$translate($errors[key])}</small>
						{/if}
					</div>
				{/if}
			{/each}

			{#if generalError}
				<small class="block text-sm text-danger">{$translate(generalError)}</small>
			{/if}

			<Button
				type={ButtonTypes.Submit}
				disabled={isSubmitDisabled()}
				tailwind="w-full flex items-center justify-center"
			>
				{#if isLoading}
					<LoadingSpinner size="md" />
				{:else}
					{$translate(`${prefix}.submit`)}
				{/if}
			</Button>
		</div>
	</form>
	<Toaster />
</div>
