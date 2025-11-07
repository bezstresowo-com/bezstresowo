<script lang="ts">
	import { resolve } from '$app/paths';
	import { createForm } from 'svelte-forms-lib';
	import {
		FIELD_MAP,
		FORM_FIELDS,
		FORM_FIELDS_ORDER,
		FORM_INITIAL_VALUE,
		SCHEMA,
		type BackendErrorResponse,
		type ContactFormValue
	} from './model';
	import { getBaseHeaders } from '$shared/global/functions/get-base-headers';
	import { HttpStatus } from '$shared/global/enums/http-status';
	import { translate } from '$i18n';
	import type { ContactRequestDto } from '$api/contact/model';
	import { HttpMethod } from '$shared/global/enums/http-method';
	import { CONTACT_INFO } from './contactInfo';
	import toast, { Toaster } from 'svelte-5-french-toast';

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
		async onSubmit({ email, message, nameAndSurname, phone }) {
			isLoading = true;
			try {
				const body = JSON.stringify({
					email,
					tel: phone,
					nameAndSurname,
					message
				} satisfies ContactRequestDto);

				const response = await fetch(resolve('/api/contact'), {
					method: HttpMethod.POST,
					headers: getBaseHeaders(),
					body
				});

				const resBody: BackendErrorResponse = await response.json().catch(() => ({}));

				switch (response.status) {
					case HttpStatus.OK:
						generalError = null;
						handleReset();
						toast.success($translate('user.contactForm.toast.success'));
						break;

					case HttpStatus.BAD_REQUEST: {
						const serverErrors = resBody?.errors ?? [];
						if (serverErrors.length) {
							for (const { field, messages } of serverErrors) {
								const key = FIELD_MAP[field] ?? (field as keyof ContactFormValue);
								const msg = messages?.[0];
								errors.update((e) => ({ ...e, [key]: msg }));
								touched.update((t) => ({ ...t, [key]: true }));
							}
						}
						break;
					}

					case HttpStatus.INTERNAL_SERVER_ERROR:
						toast.error($translate('user.contactForm.toast.error'));
						break;
				}
			} catch (error) {
				console.log(`General fetch error: ${(error as Error).message}`);
				toast.error($translate('user.contactForm.toast.error'));
			} finally {
				isLoading = false;
			}
		}
	});

	let isSubmitDisabled = $state(false);

	$effect(() => {
		// isSubmitDisabled = !$formState.isValid || isLoading || Object.values($touched).some((t) => t);
		// console.log({ isSubmitDisabled, isLoading, formState: $formState, touched: $touched });
	});
</script>

<section>
	<!-- Header -->
	<div class="mx-auto px-4 pt-12 pb-8 text-center">
		<h1 class="text-3xl font-semibold text-slate-800 sm:text-4xl">
			{$translate('user.contactForm.title')}
		</h1>
		<p class="mx-auto mt-3 max-w-3xl text-slate-600">
			{$translate('user.contactForm.subtitle')}
		</p>
	</div>

	<!-- Content -->
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-20 lg:grid-cols-2">
		<!-- Left: Contact info -->
		<div class="space-y-6">
			<h2 class="text-lg font-medium text-slate-700">
				{$translate('user.contactForm.infoTitle')}
			</h2>

			<!-- Phone -->
			<div class="flex items-start gap-4 p-5">
				<div class="grid h-12 w-12 place-content-center rounded-xl bg-secondary text-slate-800">
					<i class="fa-solid fa-phone text-xl" aria-hidden="true"></i>
				</div>
				<div>
					<div class="text-sm font-semibold text-slate-700">
						{$translate('user.contactForm.fields.phone.label')}
					</div>
					<div class="mt-1 text-slate-600">{CONTACT_INFO.phone}</div>
				</div>
			</div>

			<!-- Email -->
			<div class="flex items-start gap-4 p-5">
				<div class="grid h-12 w-12 place-content-center rounded-xl bg-secondary text-slate-800">
					<i class="fa-solid fa-envelope text-xl" aria-hidden="true"></i>
				</div>
				<div>
					<div class="text-sm font-semibold text-slate-700">
						{$translate('user.contactForm.fields.email.label')}
					</div>
					<div class="mt-1 break-all text-slate-600">{CONTACT_INFO.email}</div>
				</div>
			</div>

			<!-- Hours -->
			<div class="flex items-start gap-4 p-5">
				<div class="grid h-12 w-12 place-content-center rounded-xl bg-secondary text-slate-800">
					<i class="fa-solid fa-clock text-xl" aria-hidden="true"></i>
				</div>
				<div>
					<div class="text-sm font-semibold text-slate-700">
						{$translate('user.contactForm.contactInformations.hours')}
					</div>
					<div class="mt-1 text-slate-600">
						{$translate('user.contactForm.contactInformations.hoursWeek')}
						{CONTACT_INFO.hoursWeek}
					</div>
					<div class="text-slate-600">
						{$translate('user.contactForm.contactInformations.hoursSat')}
						{CONTACT_INFO.hoursSat}
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Form -->
		<form onsubmit={handleSubmit} class="p-6 sm:p-8">
			<div class="space-y-5">
				{#each FORM_FIELDS_ORDER as key, i (i + key)}
					{#if FORM_FIELDS[key].element === 'input'}
						<div>
							<label class="sr-only" for={key}
								>{$translate(`user.contactForm.fields.${key}.label`)}</label
							>
							<input
								id={key}
								name={key}
								type={FORM_FIELDS[key].type}
								bind:value={$form[key]}
								onchange={handleChange}
								onblur={handleChange}
								placeholder={$translate(`user.contactForm.fields.${key}.label`)}
								class="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-800 placeholder-slate-400 transition outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
							/>

							{#if $errors[key] && $touched[key]}
								<small class="mt-1 block text-sm text-danger">{$translate($errors[key])}</small>
							{/if}
						</div>
					{:else if FORM_FIELDS[key].element === 'textarea'}
						<div>
							<label class="sr-only" for={key}
								>{$translate(`user.contactForm.fields.${key}.label`)}</label
							>
							<textarea
								id={key}
								name={key}
								rows="5"
								bind:value={$form[key]}
								onchange={handleChange}
								onblur={handleChange}
								placeholder={$translate(`user.contactForm.fields.${key}.label`)}
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

				<button
					type="submit"
					disabled={isSubmitDisabled}
					class={`h-12 w-full rounded-lg bg-accent font-medium transition hover:bg-accent/90 ${isSubmitDisabled} ? 'cursor-not-allowed grayscale' : ''`}
				>
					{$translate('user.contactForm.submit')}
				</button>
			</div>

			{#if isLoading}
				<div
					role="status"
					class="absolute inset-0 grid place-items-center rounded-2xl bg-white/70"
				>
					<svg
						aria-hidden="true"
						class="h-8 w-8 animate-spin fill-primary text-gray-200"
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
	</div>
	<Toaster />
</section>
