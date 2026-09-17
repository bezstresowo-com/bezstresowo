<script lang="ts">
	import { t } from '$i18n';
	import GuideSection from '$lib/GuideSection/GuideSection.svelte';
	import Seo from '$lib/Seo/Seo.svelte';
</script>

<Seo title={t.meta.materials.title} description={t.meta.materials.description} />

<div class="bg-background/40 py-2 sm:py-6">
	<GuideSection standalone />
</div>
