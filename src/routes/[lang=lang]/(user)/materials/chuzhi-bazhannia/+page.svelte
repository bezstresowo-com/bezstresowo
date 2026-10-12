<script lang="ts">
import CollectionsSeries from '$lib/Materials/CollectionsSeries.svelte';
import type { PageData } from './$types';
let { data }: { data: PageData } = $props();
</script>
<CollectionsSeries noindex={data.noindex}/>
