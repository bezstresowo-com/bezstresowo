<script lang="ts">
	import { createForm } from 'svelte-forms-lib';
	import { FORM_FIELDS, FORM_FIELDS_ORDER, INITIAL_FORM_VALUE, SCHEMA } from './model';
	import { translate } from '$i18n';
	import { Dialog, Separator } from 'bits-ui';
	import TipTap from '$lib/TipTap/TipTap.svelte';

	interface Props {
		mode?: 'create' | 'update';
		initialData?: {
			title?: string;
			content?: string;
			media?: Record<string, string>;
		};
		onSubmit?: (data: {
			title: string;
			content: string | null;
			media: Record<string, string> | null;
		}) => Promise<boolean> | boolean;
	}

	let { mode = 'create', initialData, onSubmit }: Props = $props();

	let blogPostContent = $state<string | null>(initialData?.content ?? null);
	let blogPostMedia = $state<Record<string, string> | null>(initialData?.media ?? null);
	let open = $state(false);

	const {
		form,
		errors,
		touched,
		state: formState,
		handleChange,
		handleReset,
		handleSubmit
	} = createForm({
		initialValues: initialData?.title ? { title: initialData.title } : INITIAL_FORM_VALUE,
		validationSchema: SCHEMA,
		onSubmit: async (values) => {
			if (onSubmit) {
				const success = await onSubmit({
					title: values.title,
					content: blogPostContent,
					media: blogPostMedia
				});

				// Only close dialog and reset form if submission was successful
				if (success) {
					open = false;
					handleReset();
					blogPostContent = null;
					blogPostMedia = null;
				}
			}
		}
	});

	const isUpdateMode = $derived(mode === 'update');

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			// Reset form when dialog closes
			handleReset();
			blogPostContent = initialData?.content ?? null;
			blogPostMedia = initialData?.media ?? null;
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Trigger class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
		<span>
			<i class={isUpdateMode ? 'fa-solid fa-edit' : 'fa-solid fa-plus'}></i>
		</span>
		{$translate(
			isUpdateMode ? 'admin.blog.dialog.update.trigger' : 'admin.blog.dialog.create.trigger'
		)}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80">
			<Dialog.Content
				class="fixed top-[50%] left-[50%] z-50 w-[min(50rem,_calc(100dvw-2rem))] translate-x-[-50%] translate-y-[-50%] rounded-md border bg-white p-5 outline-hidden"
			>
				<Dialog.Title
					class="flex w-full items-center justify-center text-xl font-semibold tracking-tight"
				>
					{$translate(
						isUpdateMode ? 'admin.blog.dialog.update.title' : 'admin.blog.dialog.create.title'
					)}
				</Dialog.Title>

				<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

				<Dialog.Description>
					{$translate(
						isUpdateMode
							? 'admin.blog.dialog.update.description'
							: 'admin.blog.dialog.create.description'
					)}
				</Dialog.Description>

				<div>
					<form onsubmit={handleSubmit}>
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

						<TipTap
							content={initialData?.content}
							onUpdate={(html, addedMedia) => {
								blogPostContent = html;
								blogPostMedia = addedMedia;
							}}
						/>

						<div class="mt-6 flex justify-end gap-3">
							<Dialog.Close
								class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
							>
								{$translate('admin.blog.dialog.cancel')}
							</Dialog.Close>

							<button
								type="submit"
								class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
								disabled={$formState.isSubmitting}
							>
								{#if $formState.isSubmitting}
									<span>
										<i class="fa-solid fa-spinner fa-spin mr-2"></i>
									</span>
								{:else}
									<span>
										<i class={`${isUpdateMode ? 'fa-solid fa-save' : 'fa-solid fa-check'} mr-2`}
										></i>
									</span>
								{/if}
								{$translate(
									isUpdateMode
										? 'admin.blog.dialog.update.submit'
										: 'admin.blog.dialog.create.submit'
								)}
							</button>
						</div>
					</form>
				</div>

				<Dialog.Close class="absolute top-5 right-5 cursor-pointer rounded-md">
					<div>
						<span>
							<i class="fa-solid fa-xmark"></i>
						</span>
						<span class="sr-only">Close</span>
					</div>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Overlay>
	</Dialog.Portal>
</Dialog.Root>
