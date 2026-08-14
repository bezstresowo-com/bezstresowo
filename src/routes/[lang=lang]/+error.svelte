<script lang="ts">
	import { page } from '$app/state';
	import { path, t } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { HttpStatus } from '$shared/global/enums/http-status';

	const isNotFound = $derived(page.status === HttpStatus.NOT_FOUND);
	const titleKey = $derived(
		isNotFound ? 'user.pages.error.notFoundTitle' : 'user.pages.error.title'
	);
	const descriptionKey = $derived(
		isNotFound ? 'user.pages.error.notFoundDescription' : 'user.pages.error.description'
	);
</script>

<Seo title={titleKey} description={descriptionKey} noindex />

<section class="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
	<h1 class="text-4xl font-bold text-primary">{t(titleKey)}</h1>
	<p class="text-lg text-slate-600">{t(descriptionKey)}</p>

	{#if page.error?.message}
		<!-- The server only ever sends translation keys, never raw messages. -->
		<p class="text-sm text-slate-500">{t(page.error.message)}</p>
	{/if}

	<Button href={path('/home')} tailwind="bg-accent border border-accent text-primary px-6 py-3">
		{t('user.pages.error.backHome')}
	</Button>
</section>
