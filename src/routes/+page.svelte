<script lang="ts">
	import { Tiptap } from '$lib';

	let editorContent = $state('<p>Start typing to see the editor in action...</p>');

	function handleUpdate(content: string) {
		editorContent = content;
	}
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-2xl font-bold mb-6">TipTap Editor Demo</h1>
	
	<div class="mb-6">
		<Tiptap content={editorContent} onUpdate={handleUpdate} />
	</div>

	<div class="mt-6">
		<h2 class="text-lg font-semibold mb-2">Editor Content (HTML):</h2>
		<pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{editorContent}</pre>

		<div class="prose prose-sm max-w-none mt-4 p-4 border border-gray-200 rounded-lg bg-white">{@html editorContent}</div>
	</div>
</div>
