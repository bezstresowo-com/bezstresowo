# Audyt — 14.08.2026

`npm run check`, `lint`, `vite build` — czyste. Sitemap, migracja artykułów i endpoint crona
przetestowane na żywo (dev + lokalna baza). Kod jest gotowy na deploy — poniżej checklista
rzeczy, które musisz zrobić ręcznie, żeby produkcja śmigała.

## ✅ Checklista — do zrobienia przez Ciebie

- [ ] **Vercel env: `CRON_SECRET`** (np. `openssl rand -hex 32`) — bez niego media-sweep
      zawsze zwraca 401. Vercel Cron sam dołączy go jako `Authorization: Bearer`.
- [ ] **Vercel env: `PUBLIC_SITE_URL=https://bezstresowo.org`** — jest fallback na ten adres,
      ale lepiej ustawić jawnie.
- [ ] **Deploy** — build sam robi `prisma db push` (założy nowe kolekcje i indeksy).
- [ ] **Migracja danych** (po deployu / db push) — jeden skrypt: przenosi 2 stare artykuły
      i zakłada produkty (6 terapii + konsultacja z cennika, ceny z żywego Stripe,
      tłumaczenia pl + uk):

  ```sh
  npx prisma generate
  DATABASE_URL="<prod url>" npm run migrate:prod-data -- --dry-run   # podgląd
  DATABASE_URL="<prod url>" npm run migrate:prod-data                # migracja
  ```

- [ ] **Zweryfikować produkty w `/admin/shop`** po migracji — nazwy/ceny/tłumaczenia,
      ewentualnie dodać opisy i zdjęcia (seed zostawia je puste, tak jak było w Stripe).
- [ ] **Stripe dashboard**: webhook na `https://bezstresowo.org/api/stripe/webhook`
      (event `checkout.session.completed`) i `STRIPE_WHSEC` z tego produkcyjnego
      endpointu w env Vercela.
- [ ] **Po deployu**: sprawdzić, że cron widnieje w Vercel → Project → Settings → Cron Jobs
      (skonfigurowany w `vercel.json`, codziennie 03:00 UTC).
- [ ] **Google Search Console**: zgłosić `https://bezstresowo.org/sitemap.xml`.
- [ ] **Facebook Sharing Debugger**: odświeżyć miniatury og:image (bywają cache'owane).
- [ ] _(opcjonalnie, do decyzji)_ **Captcha**: konto Cloudflare Turnstile, klucze
      `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` w env, flaga
      `CONTACT_FORM_CAPTCHA_ENABLED` na `true`.

## Naprawione w ramach audytu (już w kodzie, nic nie musisz robić)

- **Skrypt migracyjny był zepsuty** — importował `client.js`, a generator prisma emituje
  TypeScript; nie dawał się uruchomić w ogóle. Chodzi teraz przez `tsx` (devDependency).
  Przetestowany E2E na lokalnej bazie z dokumentem w kształcie legacy: dry-run, migracja,
  idempotencja, transliteracja slugów, `$unset` starych pól, zachowanie dat.
- **Seed produktów wbudowany w migrację** (`scripts/migrate-prod-data.js`, dawniej
  `migrate-blog-articles.js`) — katalog ściągnięty z żywego Stripe starej produkcji
  (6 produktów `registrations`+`shop` po 250/350 zł, kolejność `orderKey` a–f, plus
  „Konsultacja psychoterapeutyczna" tylko na cenniku, jako pierwsza — jak na starej
  stronie). Każdy produkt dostaje tłumaczenie pl-PL i uk-UA oraz JSON-LD jak z panelu
  admina; idempotentne po slugu. Zweryfikowane na dev: `/pl/shop`, `/uk/shop`
  i `/pl/price-list` renderują komplet z poprawnymi cenami i ukraińskimi nazwami.
- **Media-sweep pod Vercel Cron** — endpoint przyjmował tylko POST, a Vercel Cron wysyła
  wyłącznie GET; dodany handler GET (ten sam kod, ta sama autoryzacja) i `vercel.json`
  z harmonogramem `0 3 * * *`. Zweryfikowane: GET i POST bez tokenu → 401.
- **Netlify wywalone** (`netlify.toml`, wpisy w `.gitignore`, komentarze) — apka żyje tylko
  na Vercelu; `adapter-auto` sam wybiera tam `adapter-vercel`.
- **Martwe `ADMIN_PASSWORD`** usunięte z `.env.example` (kod używa `ADMIN_PASSWORD_HASH`).

## Uwagi kodowe (nieblokujące, do zrobienia kiedyś)

1. **[niska]** Komunikat błędu captchy nie dociera do użytkownika — catch w
   `ContactForm.svelte` pokazuje generyczny toast zamiast `remoteErrorMessage(error)`;
   klucz `api.contact.errors.captcha` (i `.general`) jest martwy klientowo.
2. **[niska]** `<i>Brak wiadomości</i>` (`webhook/+server.ts`, `contact.remote.ts`)
   niezlokalizowane — polski wtręt w ukraińskim mailu klienta.
3. **[średnia, istniejące wcześniej]** Brak escapowania HTML danych użytkownika w mailach
   (`htmlKeyValueReplacer` + interpolacja) — formularz kontaktowy działa jak nadajnik
   dowolnego HTML „od" bezstresowo.org na dowolny adres (wektor phishingowy). Captcha to
   ograniczy, ale wartości i tak warto escapować.
4. **[kosmetyczna]** `translateWith` (`i18n.ts:67`) interpoluje stringiem — `$&`, `$$`
   w danych użytkownika zniekształcą tekst; użyć `replace(regex, () => value)`.
5. **[info]** `sendRegistrationRequest` (`contact.remote.ts`) — martwy kod, zero wywołań.

## Zweryfikowane (nie trzeba wracać)

- `/sitemap.xml` na żywo: 200, poprawny XML, cache 1h, hreflang + x-default, tylko
  indeksowalne strony; slugi mają ścisły regex, więc nie złamią XML.
- Przepływ języka: DTO → metadata Stripe (`lang`) → webhook; stare sesje bez `lang` → polski.
- Placeholdery szablonów maili kompletne w PL i UK (klucz po kluczu).
- Captcha fail-closed (brak sekretu / timeout Cloudflare → odrzucenie); flaga off = nic się
  nie ładuje.
- Stare URL-e bez prefixu językowego 301-ują na `/pl/...` (catch-all `[...missing]`).
