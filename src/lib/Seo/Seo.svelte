<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, t } from '$i18n';
	import { absoluteUrl } from '$shared/global/functions/site-url';

	import {
		alternateUrl,
		defaultAlternates,
		hreflang,
		ogImageUrl,
		stripLocalePrefix,
		xDefaultUrl,
		type SeoProps
	} from './model';

	let {
		title,
		description,
		noindex = false,
		alternates,
		image,
		imageAlt,
		ogType = 'website',
		jsonLd
	}: SeoProps = $props();

	const locale = $derived(getLocale());
	const pathWithoutPrefix = $derived(stripLocalePrefix(page.url.pathname));
	const languageVersions = $derived(alternates ?? defaultAlternates(pathWithoutPrefix));

	const resolvedTitle = $derived(t(title));
	const resolvedDescription = $derived(description ? t(description) : '');
	const canonical = $derived(absoluteUrl(page.url.pathname));
	const previewImage = $derived(image ?? ogImageUrl(locale, resolvedTitle, resolvedDescription));
	const previewImageAlt = $derived(imageAlt ? t(imageAlt) : t('meta.ogImageAlt'));
</script>

<svelte:head>
	<title>{resolvedTitle}</title>

	{#if resolvedDescription}
		<meta name="description" content={resolvedDescription} />
	{/if}

	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<link rel="canonical" href={canonical} />

	{#each languageVersions as alternate (alternate.locale)}
		<link rel="alternate" hreflang={hreflang(alternate.locale)} href={alternateUrl(alternate)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={xDefaultUrl(languageVersions)} />

	<!-- Open Graph -->
	<meta property="og:site_name" content={t('meta.siteName')} />
	<meta property="og:locale" content={locale.replace('-', '_')} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={resolvedTitle} />
	{#if resolvedDescription}
		<meta property="og:description" content={resolvedDescription} />
	{/if}
	<meta property="og:image" content={previewImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={previewImageAlt} />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={resolvedTitle} />
	{#if resolvedDescription}
		<meta name="twitter:description" content={resolvedDescription} />
	{/if}
	<meta name="twitter:image" content={previewImage} />
	<meta name="twitter:image:alt" content={previewImageAlt} />

	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
	{/if}
</svelte:head>
