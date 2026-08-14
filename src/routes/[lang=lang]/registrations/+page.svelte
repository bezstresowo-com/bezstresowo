<script lang="ts">
	import { getLocale, t } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import { ButtonTypes } from '$lib/Button/model';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { createRegistrationCheckout } from '$remote/checkout.remote';
	import { getProducts } from '$remote/products.remote';
	import { formatMoney } from '$shared/global/functions/format-money';
	import { remoteErrorIssues, remoteErrorMessage } from '$shared/global/functions/remote-error';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { createForm } from 'svelte-forms-lib';

	import { FIELD_MAP, FORM_INITIAL_VALUE, prefix, SCHEMA, type FormValue } from './model';

	let isLoading = $state(false);
	let generalError = $state<string | null>(null);

	// Consultations are ordinary products of our own - Stripe only opens the checkout.
	const productsQuery = $derived(getProducts({ lang: getLocale(), siteLocation: 'registrations' }));
	const registrationProducts = $derived(productsQuery.current ?? []);

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
				const selectedProduct = registrationProducts.find(
					(product) => product.id === values.therapyProductId
				);

				if (!selectedProduct) {
					toast.error(t(`${prefix}.toast.noPriceAvailable`));
					return;
				}

				const session = await createRegistrationCheckout({
					productId: selectedProduct.id,
					lang: getLocale(),
					therapyName: selectedProduct.name,
					nameAndSurname: values.nameAndSurname,
					tel: values.tel,
					email: values.email,
					message: values.message || undefined
				});

				if (session.url) {
					handleReset();
					window.location.href = session.url;
				} else {
					toast.error(t(`${prefix}.toast.checkoutError`));
				}
			} catch (error) {
				const issues = remoteErrorIssues(error);

				if (Object.keys(issues).length > 0) {
					for (const [field, messages] of Object.entries(issues)) {
						const key = FIELD_MAP[field] ?? (field as keyof FormValue);
						errors.update((current) => ({ ...current, [key]: messages[0] }));
						touched.update((current) => ({ ...current, [key]: true }));
					}
				} else {
					generalError = remoteErrorMessage(error);
					toast.error(t(`${prefix}.toast.checkoutError`));
				}
			} finally {
				isLoading = false;
			}
		}
	});

	const isSubmitDisabled = $derived(isLoading || !$isValid || productsQuery.loading);

	function handleTherapyTypeChange(value: string) {
		updateValidateField('therapyProductId', value);
	}
</script>

<Seo title="meta.registrations.title" description="meta.registrations.description" />

<Toaster />

<div class="h-full">
	<div
		class="flex h-50 flex-col items-center justify-center bg-linear-170 from-primary to-primary/90 p-2"
	>
		<h1 class="mx-auto text-center text-4xl font-bold text-white sm:text-5xl">
			{t(`${prefix}.title`)}
		</h1>
		<div class="mx-auto mt-5 text-center text-secondary">
			{t(`${prefix}.titleDescription`)}
		</div>
	</div>

	<form onsubmit={handleSubmit} class="mx-auto mt-10 mb-10 max-w-160 p-6 sm:mt-20">
		<div class="space-y-5">
			<!-- Typ terapii -->
			<div>
				<label for="therapyType" class="mb-1 block text-sm font-medium text-primary">
					{t(`${prefix}.therapyType.label`)}
				</label>
				{#if productsQuery.loading}
					<div
						class="flex h-12 items-center justify-center rounded-lg border border-primary/30 bg-white"
					>
						<LoadingSpinner size="sm" />
					</div>
				{:else if productsQuery.error}
					<div
						class="flex h-12 items-center rounded-lg border border-danger/30 bg-white px-4 text-danger"
					>
						{t(`${prefix}.therapyType.errors.loadError`)}
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
							{t(`${prefix}.therapyType.placeholder`)}
						</option>

						{#each registrationProducts as registrationProduct (registrationProduct.id)}
							<option value={registrationProduct.id}>
								{registrationProduct.name} - {formatMoney(
									registrationProduct.priceInMinorUnits,
									registrationProduct.currency,
									getLocale()
								)}
							</option>
						{/each}
					</select>
				{/if}
				{#if $errors.therapyProductId}
					<small class="mt-1 block text-sm text-danger"
						>{t($errors.therapyProductId)}</small
					>
				{/if}
			</div>

			<!-- Imię i nazwisko -->
			<div>
				<label for="nameAndSurname" class="mb-1 block text-sm font-medium text-primary">
					{t(`${prefix}.nameAndSurname.label`)}
				</label>
				<input
					id="nameAndSurname"
					name="nameAndSurname"
					type="text"
					bind:value={$form.nameAndSurname}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={t(`${prefix}.nameAndSurname.placeholder`)}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				/>
				{#if $errors.nameAndSurname && $touched.nameAndSurname}
					<small class="mt-1 block text-sm text-danger">{t($errors.nameAndSurname)}</small>
				{/if}
			</div>

			<!-- Email -->
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-primary">
					{t(`${prefix}.email.label`)}
				</label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={$form.email}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={t(`${prefix}.email.placeholder`)}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				/>
				{#if $errors.email && $touched.email}
					<small class="mt-1 block text-sm text-danger">{t($errors.email)}</small>
				{/if}
			</div>

			<!-- Telefon -->
			<div>
				<label for="tel" class="mb-1 block text-sm font-medium text-primary">
					{t(`${prefix}.tel.label`)}
				</label>
				<input
					id="tel"
					name="tel"
					type="tel"
					bind:value={$form.tel}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={t(`${prefix}.tel.placeholder`)}
					class="h-12 w-full rounded-lg border border-primary/30 bg-white px-4 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				/>
				{#if $errors.tel && $touched.tel}
					<small class="mt-1 block text-sm text-danger">{t($errors.tel)}</small>
				{/if}
			</div>

			<!-- Wiadomość -->
			<div>
				<label for="message" class="mb-1 block text-sm font-medium text-primary">
					{t(`${prefix}.message.label`)}
					<span class="text-xs text-primary/50">({t(`${prefix}.message.optional`)})</span>
				</label>
				<textarea
					id="message"
					name="message"
					rows="4"
					bind:value={$form.message}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={t(`${prefix}.message.placeholder`)}
					maxlength="500"
					class="w-full rounded-lg border border-primary/30 bg-white px-4 py-3 text-primary placeholder-primary/50 transition outline-none focus:border-primary"
				></textarea>
				<div class="mt-1 flex justify-between">
					{#if $errors.message && $touched.message}
						<small class="text-sm text-danger">{t($errors.message)}</small>
					{:else}
						<span></span>
					{/if}
					<small class="text-primary/50">{$form.message?.length || 0}/500</small>
				</div>
			</div>

			{#if generalError}
				<small class="block text-sm text-danger">{t(generalError)}</small>
			{/if}

			<Button
				type={ButtonTypes.Submit}
				disabled={isSubmitDisabled}
				tailwind="w-full flex items-center justify-center"
			>
				{#if isLoading}
					<LoadingSpinner size="md" />
				{:else}
					{t(`${prefix}.submit`)}
				{/if}
			</Button>
		</div>
	</form>

	<Toaster />
</div>
