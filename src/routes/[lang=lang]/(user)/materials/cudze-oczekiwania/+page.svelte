<script lang="ts">
import CollectionsSeriesPL from '$lib/Materials/CollectionsSeriesPL.svelte';
import type { PageData } from './$types';
let { data }: { data: PageData } = $props();
</script>
<CollectionsSeriesPL noindex={data.noindex}/>
