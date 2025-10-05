<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { HttpMethod } from '$shared/global/enums/http-method';

	let { children, data } = $props();

	async function handleLogout() {
		try {
			const response = await fetch(resolve('/api/admin/logout'), {
				method: HttpMethod.DELETE
			});

			if (response.ok) {
				goto(resolve('/(admin)/admin/login'));
			} else {
				console.error('Logout failed');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<h1 class="text-lg font-bold">Bezstresowo Admin Panel</h1>
				</div>
				<div class="flex items-center space-x-4">
					{#if data.isAuthenticated}
						<button
							onclick={handleLogout}
							class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						>
							Logout
						</button>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl p-4">
		{@render children()}
	</main>
</div>
