<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { Props } from './model';
	import { isNil } from 'lodash-es';
	import { Video } from './extensions/Video';

	let { content = '', onUpdate }: Props = $props();

	let element: HTMLDivElement | null = null;
	let editor: Editor | null = null;
	let editorState: { editor: Editor | null } = $state({ editor: null });

	onMount(() => {
		if (!element) return;

		editor = new Editor({
			element,
			extensions: [StarterKit, Video],
			content,
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				content = html;
				onUpdate?.(html);
				editorState = { editor };
			},
			onSelectionUpdate: ({ editor }) => {
				editorState = { editor };
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	// Update editor content when prop changes
	$effect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content, { emitUpdate: false });
		}
	});

	let fileInput: HTMLInputElement;

	function setVideo() {
		if (isNil(editor)) return;

		// Show options for URL or file upload
		const choice = window.confirm(
			'Click OK to enter a video URL, or Cancel to upload a file from your computer'
		);

		if (choice) {
			// URL input
			const existingVideoSrc = editor.getAttributes('video').src;
			const videoSrc = window.prompt('Video URL', existingVideoSrc);

			if (videoSrc) {
				insertVideoWithSrc(videoSrc);
			}
		} else {
			// File upload
			fileInput.click();
		}
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file && file.type.startsWith('video/')) {
			// Create a local URL for the uploaded video file
			const videoSrc = URL.createObjectURL(file);
			insertVideoWithSrc(videoSrc);
		} else if (file) {
			alert('Please select a valid video file.');
		}

		// Reset the input
		target.value = '';
	}

	function insertVideoWithSrc(videoSrc: string) {
		if (isNil(editor)) return;

		if (editor.isActive('video')) {
			editor.commands.updateAttributes('video', { src: videoSrc });
		} else {
			editor.chain().focus().insertContent(`<video src="${videoSrc}"></video>`).run();
		}
	}
</script>

<div class="relative overflow-hidden rounded-lg border border-gray-300 bg-white">
	{#if !isNil(editorState?.editor)}
		<div class="border-b border-gray-200 bg-gray-50 px-3 py-2">
			<div class="flex flex-wrap gap-1">
				<button
					onclick={setVideo}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'video'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					📹 Video
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleHeading({ level: 1 }).run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'heading',
						{ level: 1 }
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					H1
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleHeading({ level: 2 }).run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'heading',
						{ level: 2 }
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					H2
				</button>
				<button
					onclick={editorState.editor.chain().focus().setParagraph().run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'paragraph'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					P
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleBold().run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'bold'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					<strong>B</strong>
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleItalic().run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'italic'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					<em>I</em>
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleBulletList().run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'bulletList'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					Unordered List
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleOrderedList().run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'orderedList'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					Numbered List
				</button>
			</div>
		</div>
	{/if}

	<div
		bind:this={element}
		class="prose prose-sm min-h-[200px] max-w-none px-4 pt-2 pb-4 focus-within:outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:pt-0 [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:my-3 [&_.ProseMirror_h1:first-child]:mt-0 [&_.ProseMirror_h2]:my-2 [&_.ProseMirror_h2:first-child]:mt-0 [&_.ProseMirror_li]:my-0 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_p]:my-2 [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_ul]:my-2"
	></div>
</div>

<!-- Hidden file input for video upload -->
<input
	bind:this={fileInput}
	type="file"
	accept="video/*"
	onchange={handleFileUpload}
	style="display: none;"
/>
