<script lang="ts">
	import { Dialog, Separator } from 'bits-ui';
	import { translate } from '$i18n';

	interface Props {
		blogTitle: string;
		isDeleting?: boolean;
		onConfirm: () => void | Promise<void>;
	}

	let { blogTitle, isDeleting = false, onConfirm }: Props = $props();

	let deleteConfirmation = $state('');
	let open = $state(false);

	const isValid = $derived(deleteConfirmation.toLowerCase() === 'delete');

	async function handleConfirm() {
		if (isValid) {
			await onConfirm();
			open = false;
			deleteConfirmation = '';
		}
	}

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			deleteConfirmation = '';
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Trigger
		class="cursor-pointer rounded-md bg-red-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-600"
	>
		<i class="fa-solid fa-trash"></i>
		{$translate('admin.blog.actions.delete')}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80">
			<Dialog.Content
				class="fixed top-[50%] left-[50%] z-50 w-[min(30rem,_calc(100dvw-2rem))] translate-x-[-50%] translate-y-[-50%] rounded-md border bg-white p-5 outline-hidden"
			>
				<Dialog.Title
					class="flex w-full items-center justify-center text-xl font-semibold tracking-tight text-red-600"
				>
					<i class="fa-solid fa-triangle-exclamation mr-2"></i>
					{$translate('admin.blog.deleteDialog.title')}
				</Dialog.Title>

				<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

				<Dialog.Description class="mb-4 text-gray-700">
					{$translate('admin.blog.deleteDialog.description')}
					<strong class="mt-2 block text-black">"{blogTitle}"</strong>
				</Dialog.Description>

				<div class="mb-4">
					<label for="delete-confirmation" class="mb-2 block text-sm font-medium text-gray-700">
						{$translate('admin.blog.deleteDialog.confirmLabel')}
					</label>
					<input
						id="delete-confirmation"
						type="text"
						bind:value={deleteConfirmation}
						placeholder={$translate('admin.blog.deleteDialog.confirmPlaceholder')}
						class={`w-full rounded-md border px-3 py-2 focus:border-gray-500 ${!isValid && deleteConfirmation ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{#if deleteConfirmation && !isValid}
						<small class="mt-1 block text-sm text-red-500">
							{$translate('admin.blog.deleteDialog.confirmError')}
						</small>
					{/if}
				</div>

				<div class="flex justify-end gap-3">
					<Dialog.Close
						class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
						disabled={isDeleting}
					>
						{$translate('admin.blog.deleteDialog.cancel')}
					</Dialog.Close>

					<button
						type="button"
						onclick={handleConfirm}
						disabled={!isValid || isDeleting}
						class="cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isDeleting}
							<span>
								<i class="fa-solid fa-spinner fa-spin"></i>
							</span>
						{:else}
							<span>
								<i class="fa-solid fa-trash"></i>
							</span>
						{/if}
						{$translate('admin.blog.deleteDialog.confirm')}
					</button>
				</div>

				<Dialog.Close class="absolute top-5 right-5 cursor-pointer rounded-md">
					<div>
						<i class="fa-solid fa-xmark"></i>
						<span class="sr-only">Close</span>
					</div>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Overlay>
	</Dialog.Portal>
</Dialog.Root>
