<script lang="ts">
	import Blog from '$lib/Blog/Blog.svelte';
	import { translate } from '$i18n';

	const prefix = 'user.pages.blog';
</script>

<svelte:head>
	<title>{$translate(`${prefix}.title`)} - Bezstresowo</title>
	<meta name="description" content={$translate(`${prefix}.description`)} />
</svelte:head>

<Blog title="user.pages.blog.title" isPreview={false} pageSize={20} />
