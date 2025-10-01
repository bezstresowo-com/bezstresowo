<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { translate } from '$i18n';
	import { HttpMethod } from '$shared/global/enums/http-method';
	import { getBaseHeaders } from '$shared/global/functions/get-base-headers';
	import { isEmpty, isNil } from 'lodash-es';
	import { onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	let isValid = $state(false);
	let isLoading = $state(false);
	let httpError = $state<string | null>(null);

	const formInitialValue = {
		password: ''
	};

	const formValidationSchema = yup.object().shape({
		password: yup.string().required('Password is required')
	});

	const {
		form,
		errors,
		touched,
		state: formState,
		handleChange,
		handleSubmit
	} = createForm({
		initialValues: formInitialValue,
		validationSchema: formValidationSchema,
		async onSubmit(values) {
			httpError = null;
			isLoading = true;

			try {
				const response = await fetch(resolve('/api/admin/login'), {
					method: HttpMethod.POST,
					headers: getBaseHeaders(),
					body: JSON.stringify({ password: values.password })
				});

				const result = await response.json();

				if (response.ok) {
					goto(resolve('/(admin)/admin'));
				} else {
					httpError = result.message;
				}
			} catch (err) {
				httpError = 'An error occurred during login';
				console.error('Login error:', err);
			}

			isLoading = false;

			form.set(formInitialValue);
			touched.set({} as any);
			errors.set({} as any);
		}
	});

	const unsub = formState.subscribe(({ errors, form, ...formState }) => {
		const hasErrors = Object.values(errors).some((error) => !isEmpty(error));
		const hasMissingValues = Object.values(form).some((value) => isEmpty(value) || isNil(value));

		isValid = formState.isValid && !hasMissingValues && !hasErrors;
	});

	onDestroy(() => {
		unsub();
	});
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
			<p class="mt-2 text-center text-sm text-gray-600">Enter your admin password to continue</p>
		</div>

		<form class="mt-8 space-y-6" onsubmit={handleSubmit}>
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						bind:value={$form.password}
						onchange={handleChange}
						onblur={handleChange}
						class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="Admin password"
						disabled={isLoading}
					/>
				</div>
			</div>

			{#if !isNil(httpError)}
				<div class="rounded-md bg-red-50 p-4">
					<div class="text-sm text-red-700">
						{$translate(httpError)}
					</div>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={!isValid || isLoading}
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isLoading}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Signing in...
					{:else}
						Sign in
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
