<script lang="ts">
	import Blog from '$lib/Blog/Blog.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title="meta.blog.title" description="meta.blog.description" />

<Blog title="user.pages.blog.title" isPreview={false} pageSize={20} />
