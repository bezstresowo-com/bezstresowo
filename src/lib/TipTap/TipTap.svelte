<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { Props } from './model';
	import { isNil } from 'lodash-es';
	import { Image } from './extensions/Image';
	import { Video } from './extensions/Video';
	import FileHandler from '@tiptap/extension-file-handler';
	import { v4 } from 'uuid';

	let { content = '', onUpdate }: Props = $props();

	let element: HTMLDivElement | null = null;
	let editor: Editor | null = null;
	let editorState: { editor: Editor | null } = $state({ editor: null });

	let addedFiles: Record<string, File> = $state({});

	function onFileHandlerEvent(currentEditor: Editor, files: File[], pos: number) {
		files.forEach((file) => {
			const fileReader = new FileReader();

			let type = '';
			switch (true) {
				case !isNil(file.type.match(/image\/.*/)):
					type = 'image';
					break;

				case !isNil(file.type.match(/video\/.*/)):
					type = 'video';
					break;

				default:
					alert('Unsupported file!');
					return;
			}

			const id = v4();
			addedFiles[id] = file;
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				currentEditor
					.chain()
					.insertContentAt(pos, {
						type,
						attrs: {
							id,
							src: fileReader.result
						}
					})
					.focus()
					.run();
			};
		});
	}

	onMount(() => {
		if (!element) return;

		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Image.configure({
					HTMLAttributes: {
						class: 'object-contain w-fit aspect-video max-h-80 mx-auto'
					}
				}),
				Video,
				FileHandler.configure({
					onDrop(currentEditor, files, pos) {
						onFileHandlerEvent(currentEditor, files, pos);
					},
					onPaste(currentEditor, files) {
						onFileHandlerEvent(currentEditor, files, currentEditor.state.selection.anchor);
					}
				})
			],
			content,
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				content = html;
				onUpdate?.(html, addedFiles);
				editorState = { editor };
			},
			onSelectionUpdate: ({ editor }) => {
				editorState = { editor };
			},
			onDelete(props) {
				if (
					props.type === 'node' &&
					(props.node.type.name === 'image' || props.node.type.name === 'video')
				) {
					const id = props.node.attrs['id'] as string;
					delete addedFiles[id];
				}
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div class="relative overflow-hidden rounded-lg border border-gray-300 bg-white">
	{#if !isNil(editorState?.editor)}
		<div class="border-b border-gray-200 bg-gray-50 px-3 py-2">
			<div class="flex flex-wrap gap-1">
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
					onclick={editorState.editor.chain().focus().toggleHeading({ level: 3 }).run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'heading',
						{ level: 3 }
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					H3
				</button>
				<button
					onclick={editorState.editor.chain().focus().toggleHeading({ level: 4 }).run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'heading',
						{ level: 4 }
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					H4
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
					onclick={editorState.editor.chain().focus().toggleUnderline().run}
					class="rounded border px-3 py-1 text-sm font-medium transition-colors {editorState.editor.isActive(
						'underline'
					)
						? 'border-blue-300 bg-blue-100 text-blue-700'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}"
				>
					<span class="underline">U</span>
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
		class="editor prose prose-lg min-h-[200px] max-w-none px-4 pt-2 pb-4 focus-within:outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:pt-0 [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:my-3 [&_.ProseMirror_h1:first-child]:mt-0 [&_.ProseMirror_h2]:my-2 [&_.ProseMirror_h2:first-child]:mt-0 [&_.ProseMirror_li]:my-0 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_p]:my-2 [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror-selectednode]:outline-1 [&_.ProseMirror-selectednode]:outline-primary"
	></div>
</div>
