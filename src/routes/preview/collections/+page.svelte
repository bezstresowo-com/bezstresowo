<script lang="ts">
 import { goto } from '$app/navigation';
 import { COLLECTIONS, SERIES_PATH, collectionPath } from '$lib/Materials/collections-catalog';
 import { COLLECTIONS_PL, SERIES_PATH_PL, collectionPathPL } from '$lib/Materials/collections-catalog-pl';
 let {data}=$props();
 const pl=$derived(data.lang==='pl');
 const collections=$derived(pl?COLLECTIONS_PL:COLLECTIONS);
 const seriesPath=$derived(pl?SERIES_PATH_PL:SERIES_PATH);
 let width=$state('390');
 let selectedPath=$state('');
 const path=$derived(selectedPath||seriesPath);
 $effect(()=>{selectedPath='';void seriesPath;});
</script>
<svelte:head><title>Перегляд сторінок збірок | Bezstresowo</title><meta name="robots" content="noindex, nofollow"/></svelte:head>
<div class="review-shell">
 <div class="toolbar"><a href={seriesPath}>← Каталог</a><label>Мова<select value={data.lang} onchange={(event)=>goto('/preview/collections?lang='+event.currentTarget.value)}><option value="uk">Українська</option><option value="pl">Polski</option></select></label><label>Сторінка<select bind:value={selectedPath}><option value="">Уся серія</option>{#each collections as item}<option value={pl?collectionPathPL(item):collectionPath(item)}>{item.name}</option>{/each}</select></label><label>Екран<select bind:value={width}><option value="390">Телефон · 390 px</option><option value="320">Телефон · 320 px</option><option value="100%">Комп’ютер</option></select></label></div>
 <div class="frame-wrap"><iframe title="Попередній перегляд сторінки" src={path} style:width={width==='100%'?'100%':`${width}px`}></iframe></div>
</div>
<style>
 .review-shell{background:#e7e5e0;min-height:100vh;color:#22344e;font:13px Arial,sans-serif}.toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:22px;padding:20px;background:#fffdf8;border-bottom:1px solid #22344e26}.toolbar a{color:inherit}.toolbar label{display:flex;align-items:center;gap:10px}.toolbar select{font:inherit;padding:9px;border:1px solid #22344e40;background:#fffdf8;color:#22344e;border-radius:4px;max-width:280px}.frame-wrap{padding:24px 0;overflow:auto}iframe{display:block;max-width:100%;height:880px;margin:auto;border:0;background:#f3f0e7;box-shadow:0 8px 28px #22344e20}
</style>
