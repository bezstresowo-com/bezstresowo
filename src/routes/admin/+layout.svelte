<script lang="ts">
	import { goto } from '$app/navigation';
	import { HttpMethod } from '$shared/enums/http-method';
	import type { Props } from './layout.model';

	let { children, data }: Props = $props();

	async function handleLogout() {
		try {
			const response = await fetch('/api/admin/logout', {
				method: HttpMethod.DELETE
			});

			if (response.ok) {
				// Redirect to login page after successful logout
				goto('/admin/login');
			} else {
				console.error('Logout failed');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	{#if data.isAuthenticated}
		<!-- Admin Header with Logout -->
		<header class="border-b bg-white shadow-sm">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<div class="flex items-center">
						<h1 class="text-xl font-semibold text-gray-900">Admin Panel</h1>
					</div>
					<div class="flex items-center space-x-4">
						<button
							onclick={handleLogout}
							class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Admin Content -->
		<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			{@render children()}
		</main>
	{:else}
		<!-- Login page content -->
		{@render children()}
	{/if}
</div>
