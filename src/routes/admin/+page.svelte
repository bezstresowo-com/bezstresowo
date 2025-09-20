<script lang="ts">
	import type { PageData } from './$types';
	
	interface Props {
		data: PageData;
	}
	
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="px-4 py-6 sm:px-0">
	<div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Admin Dashboard</h1>
			<p class="text-gray-600">You are successfully authenticated as an administrator.</p>
		</div>
	</div>
</div>