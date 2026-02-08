<script lang="ts">
	import { translate } from '$i18n';
	import type { BackendErrorResponse } from '$lib/ContactForm/model';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { createForm } from 'svelte-forms-lib';
	import { FIELD_MAP, FORM_INITIAL_VALUE, prefix, SCHEMA, type FormValue } from './model';
	import { ButtonTypes } from '$lib/Button/model';
	import Button from '$lib/Button/Button.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { onMount } from 'svelte';
	import { getReservationProducts, createReservationCheckout } from './fetch-methods';
	import {
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		type LoadableState
	} from '$shared/global/types/store';
	import { resolve } from '$app/paths';
	import type { ReservationProduct } from '$api/stripe/(reservation)/reservation-products/model';

	let isLoading = $state(false);
	let generalError = $state<string | null>(null);

	let reservationProductsData = $state<LoadableState<ReservationProduct[]>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	let reservationProducts = $derived(reservationProductsData.data ?? []);

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
			generalError = null;

			try {
				const selectedProduct = reservationProducts.find((t) => t.id === values.therapyProductId);
				if (!selectedProduct?.defaultPrice) {
					toast.error($translate(`${prefix}.toast.noPriceAvailable`));
					return;
				}

				const baseUrl = window.location.origin;

				const checkoutResult = await createReservationCheckout({
					priceId: selectedProduct.defaultPrice.id,
					therapyName: reservationProducts.find(({ id }) => id === values.therapyProductId)!.name,
					nameAndSurname: values.nameAndSurname,
					tel: values.tel,
					email: values.email,
					message: values.message || undefined,
					successUrl: `${baseUrl}${resolve(`/(user)/(payments)/(reservation)/reservation-success`)}`,
					cancelUrl: `${baseUrl}${resolve(`/(user)/(payments)/(reservation)/reservation-cancel`)}`
				});

				switch (checkoutResult.status) {
					case 'ok': {
						if (checkoutResult.data.url) {
							handleReset();
							window.location.href = checkoutResult.data.url;
						} else {
							toast.error($translate(`${prefix}.toast.checkoutError`));
						}
						break;
					}

					case 'validationError': {
						const serverErrors =
							(checkoutResult.data as unknown as BackendErrorResponse)?.errors ?? [];
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

					case 'error':
					default:
						toast.error($translate(`${prefix}.toast.checkoutError`));
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

	let isSubmitDisabled = $derived(() => {
		return isLoading || !$isValid || reservationProductsData.isLoading;
	});

	function handleTherapyTypeChange(value: string) {
		updateValidateField('therapyProductId', value);
	}

	async function loadTherapyTypes() {
		const fetchResult = await getReservationProducts();

		switch (fetchResult.status) {
			case 'ok':
				reservationProductsData = {
					...LOADED,
					data: fetchResult.data.data
				};
				break;

			case 'error':
				reservationProductsData = {
					...reservationProductsData,
					...ERRORED(fetchResult.data.message)
				};
				break;

			default:
				reservationProductsData = {
					...reservationProductsData,
					...ERRORED(fetchResult.error)
				};
				break;
		}
	}

	onMount(async () => {
		await loadTherapyTypes();
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

	<form onsubmit={handleSubmit} class="mx-auto mt-10 mb-10 max-w-160 p-6 sm:mt-20">
		<div class="space-y-5">
			<!-- Typ terapii -->
			<div>
				<label for="therapyType" class="mb-1 block text-sm font-medium text-primary">
					{$translate(`${prefix}.therapyType.label`)}
				</label>
				{#if reservationProductsData.isLoading}
					<div
						class="flex h-12 items-center justify-center rounded-lg border border-primary/30 bg-white"
					>
						<LoadingSpinner size="sm" />
					</div>
				{:else if reservationProductsData.error}
					<div
						class="flex h-12 items-center rounded-lg border border-danger/30 bg-white px-4 text-danger"
					>
						{$translate(`${prefix}.therapyType.errors.loadError`)}
					</div>
				{:else}
					<select
						id="therapyType"
						name="therapyType"
						bind:value={$form.therapyProductId}
						onchange={(e) => handleTherapyTypeChange(e.currentTarget.value)}
						onblur={handleChange}
						class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary transition outline-none focus:border-primary"
					>
						<option value="" disabled>
							{$translate(`${prefix}.therapyType.placeholder`)}
						</option>

						{#each reservationProducts as reservationProduct (reservationProduct.id)}
							<option value={reservationProduct.id}
								>{reservationProduct.name}
								{reservationProduct.defaultPrice?.unit_amount
									? reservationProduct.defaultPrice.unit_amount / 100 +
										' ' +
										reservationProduct.defaultPrice.currency.toUpperCase()
									: 'N/A'}</option
							>
						{/each}
					</select>
				{/if}
				{#if $errors.therapyProductId}
					<small class="mt-1 block text-sm text-danger"
						>{$translate($errors.therapyProductId)}</small
					>
				{/if}
			</div>

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
					<span class="text-xs text-primary/50">({$translate(`${prefix}.message.optional`)})</span>
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
