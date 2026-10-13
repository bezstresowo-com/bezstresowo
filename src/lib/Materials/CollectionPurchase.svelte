<script lang="ts">
 let { id, ready, lang = 'uk' }: { id: number; ready: boolean; lang?: 'uk' | 'pl' } = $props();
 let pending = $state(false);
 let message = $state('');
 async function buy() {
  if (pending || !ready) return;
  pending = true;
  message = '';
  try {
   const response = await fetch('/api/collections/checkout', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: 'one', ids: [id], lang })
   });
   const result = await response.json();
   if (!response.ok || !result.url) throw new Error(result.message || (lang === 'pl' ? 'Nie udało się przejść do płatności. Spróbuj ponownie.' : 'Не вдалося перейти до оплати. Спробуй ще раз.'));
   window.location.assign(result.url);
  } catch (error) {
   message = error instanceof Error ? error.message : (lang === 'pl' ? 'Nie udało się przejść do płatności. Spróbuj ponownie.' : 'Не вдалося перейти до оплати. Спробуй ще раз.');
   pending = false;
  }
 }
</script>

<button class="collection-buy" onclick={buy} disabled={pending || !ready} aria-busy={pending}>{lang === 'pl' ? 'Kup zbiór' : 'Купити збірку'}</button>
<p class="purchase-message" aria-live="polite">{pending ? (lang === 'pl' ? 'Przygotowujemy płatność…' : 'Готуємо перехід до оплати…') : message}</p>

<style>
 .collection-buy{width:100%;background:#22344e;color:white;border:0;border-radius:5px;padding:17px 22px;font:700 15px Arial,sans-serif;cursor:pointer;transition:background .15s}
 .collection-buy:hover{background:#344967}.collection-buy:disabled{opacity:.5;cursor:default}
 .collection-buy:focus-visible{outline:3px solid #e5ae31;outline-offset:4px}
 .purchase-message{margin:8px 0 0;font:13px/1.5 Arial,sans-serif;color:#4d5b6c}.purchase-message:empty{display:none}
</style>
