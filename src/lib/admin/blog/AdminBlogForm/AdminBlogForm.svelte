<!-- TODO: move the entire dialog and "Create new" button here -->

<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import { FORM_FIELDS, FORM_FIELDS_ORDER, INITIAL_FORM_VALUE, SCHEMA } from './model';
	import { translate } from '$i18n';

	const {
		form,
		errors,
		touched,
		state: formState,
		handleChange,
		handleReset
	} = createForm({
		initialValues: INITIAL_FORM_VALUE,
		validationSchema: SCHEMA,
		// unused but required by the `createForm`
		onSubmit() {}
	});
</script>

<form>
	{#each FORM_FIELDS_ORDER as key, i (i + key)}
		<div class="my-6">
			<div class="relative w-full">
				<input
					id={key}
					name={key}
					type={FORM_FIELDS[key].type}
					bind:value={$form[key]}
					onchange={handleChange}
					onblur={handleChange}
					placeholder={$translate(`admin.blog.dialog.form.fields.${key}.placeholder`)}
					class={`w-full rounded-md border pr-10 focus:border-gray-500 ${$errors[key] && $touched[key] ? 'border-danger' : 'border-gray-300'}`}
				/>
			</div>

			{#if $errors[key] && $touched[key]}
				<small class="text-sm text-danger">{$translate($errors[key])}</small>
			{/if}
		</div>
	{/each}
</form>
