<script lang="ts">
	let { value }: { value?: unknown } = $props();
</script>

{#if value !== undefined && value !== null}
	<!--
		Structured data is valid in the document body. Escaping every `<` keeps
		stored content from terminating the script element.
	-->
	<!-- eslint-disable-next-line no-useless-escape -- `<\/script>` must stay escaped inside the template literal -->
	{@html `<script type="application/ld+json" data-seo-json-ld>${JSON.stringify(value).replaceAll('<', '\\u003c')}<\/script>`}
{/if}
