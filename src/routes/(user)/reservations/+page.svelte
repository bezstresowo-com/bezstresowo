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
		FORM_INITIAL_VALUE,
		prefix,
		SCHEMA,
		THERAPY_TYPES,
		createEmptyPreferredDate,
		type FormValue,
		type PreferredDate,
		type TherapyType
	} from './model';
	import { ButtonTypes } from '$lib/Button/model';
	import Button from '$lib/Button/Button.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';

	let isLoading = $state(false);
	let generalError = $state<string | null>(null);

	const {
		form,
		errors,
		touched,
		isValid,
		handleChange,
		handleSubmit,
		handleReset,
		updateValidateField
	} = createForm({
		initialValues: FORM_INITIAL_VALUE,
		validationSchema: SCHEMA,
		async onSubmit(values) {
			isLoading = true;
			try {
				const body = JSON.stringify({
					therapyType: values.therapyType as TherapyType,
					preferredDates: values.preferredDates,
					nameAndSurname: values.nameAndSurname,
					tel: values.tel,
					email: values.email,
					message: values.message || undefined
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

	function addPreferredDate() {
		if ($form.preferredDates.length < 5) {
			form.update((f) => ({
				...f,
				preferredDates: [...f.preferredDates, createEmptyPreferredDate()]
			}));
		}
	}

	function removePreferredDate(index: number) {
		if ($form.preferredDates.length > 1) {
			form.update((f) => ({
				...f,
				preferredDates: f.preferredDates.filter((_, i) => i !== index)
			}));
		}
	}

	function updatePreferredDate(index: number, field: keyof PreferredDate, value: string) {
		form.update((f) => {
			const newDates = [...f.preferredDates];
			newDates[index] = { ...newDates[index], [field]: value };
			return { ...f, preferredDates: newDates };
		});
		updateValidateField('preferredDates', $form.preferredDates);
	}

	let isSubmitDisabled = $derived(() => {
		return isLoading || !$isValid;
	});

	let showMessageRequired = $derived(() => {
		return $form.therapyType === 'other';
	});

	function handleTherapyTypeChange(value: string) {
		updateValidateField('therapyType', value);
	}
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

	<form onsubmit={handleSubmit} class="mt-10 mb-10 p-6 sm:mt-20 sm:pr-80 sm:pl-80">
		<div class="space-y-5">
			<!-- Typ terapii -->
			<div>
				<label for="therapyType" class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.therapyType.label`)}
				</label>
				<select
					id="therapyType"
					name="therapyType"
					bind:value={$form.therapyType}
					onchange={(e) => handleTherapyTypeChange(e.currentTarget.value)}
					onblur={handleChange}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary transition outline-none focus:border-primary"
				>
					<option value="" disabled>{$translate(`${prefix}.therapyType.placeholder`)}</option>
					{#each THERAPY_TYPES as type (type)}
						<option value={type}>{$translate(`${prefix}.therapyType.options.${type}`)}</option>
					{/each}
				</select>
				{#if $errors.therapyType}
					<small class="mt-1 block text-sm text-danger">{$translate($errors.therapyType)}</small>
				{/if}
			</div>

			<!-- Preferowane daty -->
			<fieldset>
				<legend class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.preferredDates.label`)}
				</legend>
				<p class="mb-3 text-xs text-primary/60">
					{$translate(`${prefix}.preferredDates.hint`)}
				</p>

				{#each $form.preferredDates as preferredDate, index (index)}
					{@const dateErrors = $errors.preferredDates?.[index] as { date?: string; timeFrom?: string; timeTo?: string } | undefined}
					<div class="mb-3 flex flex-wrap gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
						<div class="min-w-[150px] flex-1">
							<label for={`date-${index}`} class="mb-1 block text-xs text-primary/70">
								{$translate(`${prefix}.preferredDates.date`)}
							</label>
							<input
								id={`date-${index}`}
								type="date"
								value={preferredDate.date}
								onchange={(e) => updatePreferredDate(index, 'date', e.currentTarget.value)}
								class="h-10 w-full rounded-lg border border-primary/30 bg-white px-3 text-primary transition outline-none focus:border-primary"
							/>
							{#if dateErrors?.date}
								<small class="mt-1 block text-xs text-danger">{$translate(dateErrors.date)}</small>
							{/if}
						</div>
						<div class="min-w-[100px] flex-1">
							<label for={`timeFrom-${index}`} class="mb-1 block text-xs text-primary/70">
								{$translate(`${prefix}.preferredDates.timeFrom`)}
							</label>
							<input
								id={`timeFrom-${index}`}
								type="time"
								value={preferredDate.timeFrom}
								onchange={(e) => updatePreferredDate(index, 'timeFrom', e.currentTarget.value)}
								class="h-10 w-full rounded-lg border border-primary/30 bg-white px-3 text-primary transition outline-none focus:border-primary"
							/>
							{#if dateErrors?.timeFrom}
								<small class="mt-1 block text-xs text-danger">{$translate(dateErrors.timeFrom)}</small>
							{/if}
						</div>
						<div class="min-w-[100px] flex-1">
							<label for={`timeTo-${index}`} class="mb-1 block text-xs text-primary/70">
								{$translate(`${prefix}.preferredDates.timeTo`)}
							</label>
							<input
								id={`timeTo-${index}`}
								type="time"
								value={preferredDate.timeTo}
								onchange={(e) => updatePreferredDate(index, 'timeTo', e.currentTarget.value)}
								class="h-10 w-full rounded-lg border border-primary/30 bg-white px-3 text-primary transition outline-none focus:border-primary"
							/>
							{#if dateErrors?.timeTo}
								<small class="mt-1 block text-xs text-danger">{$translate(dateErrors.timeTo)}</small>
							{/if}
						</div>
						{#if $form.preferredDates.length > 1}
							<button
								type="button"
								onclick={() => removePreferredDate(index)}
								class="h-10 self-end rounded-lg px-3 text-danger transition hover:bg-red-50"
								title={$translate(`${prefix}.preferredDates.remove`)}
								aria-label={$translate(`${prefix}.preferredDates.remove`)}
							>
								<i class="fa-solid fa-trash"></i>
							</button>
						{/if}
					</div>
				{/each}

				{#if $form.preferredDates.length < 5}
					<button
						type="button"
						onclick={addPreferredDate}
						class="flex items-center gap-2 text-sm text-primary transition hover:text-primary/80"
					>
						<i class="fa-solid fa-plus"></i>
						{$translate(`${prefix}.preferredDates.add`)}
					</button>
				{/if}

				{#if $errors.preferredDates && $touched.preferredDates && typeof $errors.preferredDates === 'string'}
					<small class="mt-1 block text-sm text-danger">{$translate($errors.preferredDates)}</small>
				{/if}
			</fieldset>

			<!-- Imię i nazwisko -->
			<div>
				<label for="nameAndSurname" class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.nameAndSurname.label`)}
				</label>
				<input
					id="nameAndSurname"
					name="nameAndSurname"
					type="text"
					bind:value={$form.nameAndSurname}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`${prefix}.nameAndSurname.placeholder`)}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				/>
				{#if $errors.nameAndSurname && $touched.nameAndSurname}
					<small class="mt-1 block text-sm text-danger">{$translate($errors.nameAndSurname)}</small>
				{/if}
			</div>

			<!-- Email -->
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.email.label`)}
				</label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={$form.email}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`${prefix}.email.placeholder`)}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				/>
				{#if $errors.email && $touched.email}
					<small class="mt-1 block text-sm text-danger">{$translate($errors.email)}</small>
				{/if}
			</div>

			<!-- Telefon -->
			<div>
				<label for="tel" class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.tel.label`)}
				</label>
				<input
					id="tel"
					name="tel"
					type="tel"
					bind:value={$form.tel}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`${prefix}.tel.placeholder`)}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				/>
				{#if $errors.tel && $touched.tel}
					<small class="mt-1 block text-sm text-danger">{$translate($errors.tel)}</small>
				{/if}
			</div>

			<!-- Wiadomość -->
			<div>
				<label for="message" class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.message.label`)}
					{#if showMessageRequired()}
						<span class="text-danger">*</span>
					{:else}
						<span class="text-xs text-primary/50">({$translate(`${prefix}.message.optional`)})</span>
					{/if}
				</label>
				<textarea
					id="message"
					name="message"
					rows="4"
					bind:value={$form.message}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`${prefix}.message.placeholder`)}
					maxlength="500"
					class="w-full rounded-lg border border-primary/30 bg-white px-4 py-3 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				></textarea>
				<div class="mt-1 flex justify-between">
					{#if $errors.message && $touched.message}
						<small class="text-sm text-danger">{$translate($errors.message)}</small>
					{:else}
						<span></span>
					{/if}
					<small class="text-primary/50">{$form.message?.length || 0}/500</small>
				</div>
			</div>

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
