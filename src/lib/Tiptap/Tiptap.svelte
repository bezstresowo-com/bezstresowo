<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

	// TODO: video extension -> https://www.codemzy.com/blog/tiptap-video-embed-extension

	let { content = '' } = $props();

	let element: HTMLDivElement | null = null;
	let editor = $state<Editor | null>(null);

	onMount(() => {
		if (!element) return;

		editor = new Editor({
			element,
			extensions: [StarterKit],
			content,
			onTransaction: ({ editor: providedEditor }) => {
				editor = providedEditor;
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div style="position: relative" class="app">
	{#if editor}
		<div class="fixed-menu">
			<button
				onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
				class:active={editor?.isActive('heading', { level: 1 })}
			>
				H1
			</button>
			<button
				onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={editor?.isActive('heading', { level: 2 })}
			>
				H2
			</button>
			<button
				onclick={() => editor?.chain().focus().setParagraph().run()}
				class:active={editor?.isActive('paragraph')}
			>
				P
			</button>
		</div>
	{/if}

	<div bind:this={element}></div>
</div>
