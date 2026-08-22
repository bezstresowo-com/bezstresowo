<script lang="ts">
	import { t } from '$i18n';
	import Blog from '$lib/Blog/Blog.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title={t.meta.blog.title} description={t.meta.blog.description} />

<Blog title={t.user.pages.blog.title} isPreview={false} pageSize={20} />
