<script lang="ts">
	import { goto } from '$app/navigation';
	import { path, t } from '$i18n';
	import LanguageSelect from '$lib/LanguageSelect/LanguageSelect.svelte';
	import { logout } from '$remote/admin-auth.remote';

	let { children, data } = $props();

	async function handleLogout() {
		try {
			await logout();
			await goto(path('/admin/login'), { invalidateAll: true });
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<svelte:head>
	<title>{t.admin.title}</title>
	<!-- The panel (incl. the public login page) must never be indexed;
		`robots.txt` disallows the admin paths too, this covers pages reached by links. -->
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<h1 class="text-lg font-bold">{t.admin.title}</h1>
				</div>
				<div class="flex items-center gap-2">
					<LanguageSelect />
					{#if data.isAuthenticated}
						<button
							onclick={handleLogout}
							class="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-danger px-4 py-2 text-sm font-medium text-white"
						>
							{t.admin.logout}
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
