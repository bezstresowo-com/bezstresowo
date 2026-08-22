<script lang="ts">
	import { page } from '$app/state';
	import { localizedPath, toLocale, translationsFor } from '$i18n';
	import Button from '$lib/Button/Button.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
	import { HttpStatus } from '$shared/global/enums/http-status';

	// Errors outside `[lang=lang]` (e.g. the 404 from the legacy catch-all)
	// carry no `lang` param - best effort detection from the URL, polish default.
	const locale = $derived(toLocale(page.url.pathname.split('/').filter(Boolean)[0]));
	const copy = $derived(translationsFor(locale).user.pages.error);
	const isNotFound = $derived(page.status === HttpStatus.NOT_FOUND);
	const title = $derived(isNotFound ? copy.notFoundTitle : copy.title);
	const description = $derived(isNotFound ? copy.notFoundDescription : copy.description);
</script>

<Seo {title} noindex />

<section class="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
	<h1 class="text-4xl font-bold text-primary">{title}</h1>
	<p class="text-lg text-slate-600">{description}</p>

	<Button
		href={localizedPath('/home', locale)}
		tailwind="bg-accent border border-accent text-primary px-6 py-3"
	>
		{copy.backHome}
	</Button>
</section>
