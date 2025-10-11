<script lang="ts">
	import type { GetBlogArticlesPaginatedResponseDto } from '$api/admin/blog/model';
	import {
		DEFAULT_LOADABLE_STATE,
		ERRORED,
		LOADED,
		LOADING,
		type LoadableState
	} from '$shared/global/types/store';
	import { onMount } from 'svelte';
	import { fetchBlogPosts } from './model';
	import { translate } from '$i18n';
	import { Dialog, Separator } from 'bits-ui';
	import TipTap from '$lib/TipTap/TipTap.svelte';
	import { AdminBlogForm } from '$lib';

	let blogPosts = $state<LoadableState<GetBlogArticlesPaginatedResponseDto>>({
		...DEFAULT_LOADABLE_STATE,
		isLoading: true
	});

	async function getBlogPosts(initial = false, ...args: Parameters<typeof fetchBlogPosts>) {
		if (!initial) {
			blogPosts = {
				...blogPosts,
				...LOADING
			};
		}

		const fetchResult = await fetchBlogPosts(...args);

		switch (fetchResult.status) {
			case 'ok':
				blogPosts = {
					...LOADED,
					data: fetchResult.data
				};
				break;

			case 'error':
				blogPosts = {
					...blogPosts,
					...ERRORED(fetchResult.data.message)
				};
				break;

			default:
				console.error(fetchResult);
				blogPosts = {
					...blogPosts,
					...ERRORED(fetchResult.error)
				};
				break;
		}
	}

	let newBlogPostContent = $state<string | null>(null);
	let newBlogPostMedia = $state<Record<string, string> | null>(null);

	onMount(async () => {
		await getBlogPosts(true);
	});
</script>

<div class="mb-4 flex justify-end">
	<Dialog.Root>
		<Dialog.Trigger class="cursor-pointer rounded-md bg-blue-500 px-4 py-2 font-bold text-white">
			<i class="fa-solid fa-plus"></i>
			{$translate('admin.blog.dialog.trigger')}
		</Dialog.Trigger>

		<Dialog.Portal>
			<Dialog.Overlay class=" fixed inset-0 z-50 bg-black/80">
				<Dialog.Content
					class="fixed top-[50%] left-[50%] z-50 w-[min(50rem,_calc(100dvw-2rem))] translate-x-[-50%] translate-y-[-50%] rounded-md border bg-white p-5 outline-hidden"
				>
					<Dialog.Title
						class="flex w-full items-center justify-center text-xl font-semibold tracking-tight"
					>
						{$translate('admin.blog.dialog.title')}
					</Dialog.Title>

					<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-black" />

					<Dialog.Description>
						{$translate('admin.blog.dialog.description')}
					</Dialog.Description>

					<div>
						<AdminBlogForm />

						<TipTap
							onUpdate={(html, addedMedia) => {
								newBlogPostContent = html;
								newBlogPostMedia = addedMedia;
							}}
						/>
					</div>

					<Dialog.Close class="absolute top-5 right-5 cursor-pointer rounded-md ">
						<div>
							<i class="fa-solid fa-xmark"></i>
							<span class="sr-only">Close</span>
						</div>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Overlay>
		</Dialog.Portal>
	</Dialog.Root>
</div>
