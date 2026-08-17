- [ ] - slug dla artykolow powinien byc tylko jeden (dla wszystkich wersji jezykowych - najlepiej po angielsku)
- [ ] - slog dla produktow powiniene byc po angielsku (nie po polsku)
- [ ] - jezeli wylaczymy dana wersje artykulu bloga to nie powinnismy jej usuwac, tylko oznaczac jako `disabled` w bazie
- [ ] - edycja produktow i artykulow nie moze odbywac sie w popupie - musi miec miejsce w osobnej podstronie zwiazanej z danym entry (blog-article)


## Old

1. Zmiany jezykowe:
   - [x] - wylaczyc jezyk angielski
     - [x] - usunac angielski z przelacznika jezyka (LanguageSelect)
     - [x] - usunac lub przekierowac stare URL-e wersji angielskiej, zeby wypadly z indexu Google
       - `src/routes/[...missing]/+page.server.ts` robi 308 na `/pl/...` (lapie tez `/en/...`)
   - [x] - zmienic pliki `*.json` na `*.ts`
     - `src/i18n/translations/{pl-PL,uk-UA}.ts`; polski slownik jest typem (`Translation`), ukrainski musi go spelniac
   - [x] - domyslna wersja jezykowa to polski (`DEFAULT_LOCALE`)
   - [x] - prefixowac cala strone `/pl/` lub `/uk/` w zaleznosci od wybranego jezyka
     - wszystkie strony uzytkownika siedza pod `src/routes/[lang=lang]/`, matcher w `src/params/lang.ts`
   - [x] - html lang attr ustawiac automatycznie (`hooks.server.ts` -> `transformPageChunk`)
   - [x] - dodac hreflang na kazda strone (`$lib/Seo/Seo.svelte`, razem z `x-default` na wersje PL):
     ```html
     <link rel="alternate" hreflang="pl" href="https://bezstresowo.org/pl/home" />
     <link rel="alternate" hreflang="uk" href="https://bezstresowo.org/uk/home" />
     <link rel="alternate" hreflang="x-default" href="https://bezstresowo.org/pl/home" />
     ```
2. Zmiany SEO:
   - [x] - usunac statyczne `title` i `description` na rzecz generowanych dynamicznie i per strona
     - [x] - konkretnie usunac z `src/app.html` (zostawic charset, viewport, fonty, favicon)
     - [x] - meta ustawiac per strona przez `<svelte:head>`, per jezyk (sekcja `meta` w slownikach)
     - [x] - limity dlugosci: title do ~60 znakow, description do ~155
       - wymuszane w DTO (`META_TITLE_MAX_LENGTH` / `META_DESCRIPTION_MAX_LENGTH`) i licznikiem znakow w panelu
   - [x] - opisy `og:` i `twitter:` - to samo - generowane per jezyk
   - [x] - wartosci meta (format: `sciezka` -> `title` -> `description`):
     - [x] pl:
       - [x] `/home` -> `Psychoterapeuta Łódź | Bezstresowo - Olesya Haiduk` -> `Psychoterapia dla kobiet, par i młodzieży w Łodzi oraz online. Olesya Haiduk, analiza transakcyjna. Wsparcie z empatią i zrozumieniem. Umów wizytę.`
       - [x] `/registrations` -> `Umów konsultację psychoterapeutyczną | Łódź i online` -> `Zapisz się na konsultację u Olesyi Haiduk. Terapia indywidualna, par i młodzieży, w gabinecie w Łodzi lub online. Sprawdź dostępne terminy.`
       - [x] `/blog` -> `Blog o zdrowiu psychicznym i relacjach | Bezstresowo` -> `Artykuły psychoterapeutki o relacjach, emocjach, lęku i poczuciu własnej wartości. Praktyczna wiedza o zdrowiu psychicznym. Łódź i online.`
       - [x] `/price-list` -> `Cennik psychoterapii | Łódź i online | Bezstresowo` -> `Cennik sesji psychoterapii indywidualnej, dla par i młodzieży. Konsultacje w gabinecie w Łodzi oraz online. Sprawdź ceny i umów wizytę.`
       - [x] `/shop` -> `Sklep | Materiały wspierające dobrostan | Bezstresowo` -> `Materiały psychoedukacyjne i produkty wspierające zdrowie psychiczne. Bezstresowo, Olesya Haiduk, psychoterapia w Łodzi i online.`
       - [x] `/terms-of-service` -> `Regulamin | Bezstresowo` -> `noindex`
       - [x] `/gdpr` -> `Polityka prywatności (RODO) | Bezstresowo` -> `noindex`
     - [x] uk:
       - [x] `/home` -> `Психотерапевт Лодзь | Bezstresowo - Олеся Гайдук (Olesya Haiduk)` -> `Психотерапія для жінок, пар і підлітків у Лодзі та онлайн. Олеся Гайдук (Olesya Haiduk), транзакційний аналіз. Підтримка з емпатією. Запишіться.`
       - [x] `/registrations` -> `Запис на консультацію психотерапевта | Лодзь, онлайн` -> `Запишіться на консультацію до Олесі Гайдук (Olesya Haiduk). Індивідуальна терапія, для пар і підлітків, у кабінеті в Лодзі або онлайн.`
       - [x] `/blog` -> `Блог про психічне здоров'я та стосунки | Bezstresowo` -> `Статті психотерапевтки про стосунки, емоції, тривогу та самооцінку. Практичні знання про психічне здоров'я. Лодзь та онлайн.`
       - [x] `/price-list` -> `Ціни на психотерапію | Лодзь і онлайн | Bezstresowo` -> `Вартість сесій індивідуальної психотерапії, для пар і підлітків. Консультації в кабінеті в Лодзі та онлайн. Перегляньте ціни й запишіться.`
       - [x] `/shop` -> `Магазин | Матеріали для добробуту | Bezstresowo` -> `Психоедукаційні матеріали та продукти для підтримки психічного здоров'я. Bezstresowo, Олеся Гайдук, психотерапія в Лодзі та онлайн.`
       - [x] `/terms-of-service` -> `Правила користування | Bezstresowo` -> `noindex`
       - [x] `/gdpr` -> `Політика конфіденційності | Bezstresowo` -> `noindex`
   - [ ] - wartosci meta dla uslug (NADAL ZABLOKOWANE - wszystkie uslugi sa sekcjami na tej samej stronie `/home`, wiec nie da sie ustawic osobnego title/description per usluga):
     - propozycja: zeby uzyskac osobne meta + hreflang per usluga, kazda usluga musi miec wlasny, indeksowalny URL (np. `/pl/uslugi/pary`, `/uk/uslugi/pary`). Kotwice (`#pary`) nie zadzialaja - Google indeksuje jeden URL na strone. Trzeba by zrobic osobne podstrony (landing page) per usluga. **Do decyzji - czekamy na zielone swiatlo.**
     - infrastruktura jest juz gotowa: `<Seo />` przyjmuje `alternates`, wiec kazda nowa podstrona dostanie hreflang za darmo
     - wartosci z dokumentu (do wykorzystania, gdy powstana osobne podstrony):
       - pl:
         - pary -> `Psychoterapia par Łódź i online | Bezstresowo` -> `Terapia par w Łodzi i online. Rozwiązywanie konfliktów, poprawa komunikacji i odbudowa więzi w bezpiecznej atmosferze. Umów konsultację.`
         - kobiety -> `Psychoterapia dla kobiet Łódź i online | Bezstresowo` -> `Terapia indywidualna dla kobiet w Łodzi i online. Budowanie poczucia własnej wartości, stawianie granic i wewnętrzna równowaga. Umów wizytę.`
         - depresja i lęk -> `Psychoterapia depresji i lęku Łódź | Bezstresowo` -> `Profesjonalne wsparcie w depresji i zaburzeniach lękowych. Terapia w Łodzi i online. Odzyskaj równowagę emocjonalną. Umów konsultację.`
         - LGBTQ+ -> `Psychoterapia afirmatywna LGBTQ+ Łódź | Bezstresowo` -> `Afirmatywne wsparcie psychoterapeutyczne dla osób LGBTQ+ w Łodzi i online. Bezpieczna, wolna od oceny przestrzeń. Umów konsultację.`
         - rodzice -> `Psychoterapia i konsultacje dla rodziców | Łódź` -> `Wsparcie dla rodziców w rozumieniu emocji dziecka i wyzwaniach wychowawczych. Terapia w Łodzi i online. Umów konsultację.`
         - zaburzenia odżywiania -> `Psychoterapia zaburzeń odżywiania Łódź | Bezstresowo` -> `Specjalistyczna terapia zaburzeń odżywiania w Łodzi i online. Zrozum emocjonalne przyczyny i odbuduj relację z jedzeniem. Umów wizytę.`
       - uk:
         - pary -> `Психотерапія для пар Лодзь і онлайн | Bezstresowo` -> `Терапія для пар у Лодзі та онлайн. Вирішення конфліктів, покращення комунікації та відновлення зв'язку в безпечній атмосфері. Запишіться.`
         - kobiety -> `Психотерапія для жінок Лодзь і онлайн | Bezstresowo` -> `Індивідуальна терапія для жінок у Лодзі та онлайн. Побудова самоцінності, встановлення меж і внутрішня рівновага. Запишіться на візит.`
         - depresja i lęk -> `Психотерапія депресії та тривоги Лодзь | Bezstresowo` -> `Професійна підтримка при депресії та тривожних розладах. Терапія в Лодзі та онлайн. Поверніть емоційну рівновагу. Запишіться.`
         - LGBTQ+ -> `Афірмативна психотерапія LGBTQ+ Лодзь | Bezstresowo` -> `Афірмативна психотерапевтична підтримка для людей LGBTQ+ у Лодзі та онлайн. Безпечний простір без осуду. Запишіться на консультацію.`
         - rodzice -> `Психотерапія та консультації для батьків | Лодзь` -> `Підтримка батьків у розумінні емоцій дитини та викликах виховання. Терапія в Лодзі та онлайн. Запишіться на консультацію.`
         - zaburzenia odżywiania -> `Психотерапія розладів харчування Лодзь | Bezstresowo` -> `Спеціалізована терапія розладів харчування в Лодзі та онлайн. Зрозумійте емоційні причини й відновіть стосунки з їжею. Запишіться.`

3. Zmiany techniczne:
   - [x] - przelaczyc svelte-kit na `*.remote.ts` oraz `await` w komponentach (optymalistyczne update-y) tak jak zostalo to przedstawione w tym repo -> https://github.com/Szymonexis/sveltekit-remote-example
     - wlaczone `kit.experimental.remoteFunctions` + `compilerOptions.experimental.async`
     - caly katalog `src/routes/api/*` (poza webhookiem Stripe i cronem) oraz wszystkie `fetch-methods.ts` zastapione przez `src/remote/*.remote.ts`
     - komponenty robia `await` wewnatrz `<svelte:boundary>` (`pending` / `failed`), mutacje ida przez `command(...)` z `.updates(...)` i `.withOverride(...)` (optymistyczne usuwanie w panelu)
     - walidacja: istniejace DTO `class-validator` sa mostkowane do Standard Schema (`$shared/server/functions/dto-schema.ts`), a `handleValidationError` zwraca bledy per pole jako klucze tlumaczen
     - autoryzacja admina przeniesiona z `hooks.server.ts` do `requireAdmin()` (remote functions maja wspolny prefix `/_app/remote/...`, wiec nie da sie ich chronic po sciezce)
   - [x] - stworzyc jakis skrypt migracyjny ktory pozwoli na przelozenie istniejacych blog-articles (wszystkie istniejace artykuly sa napisane w jezyku polskim) (sprzed zmian z dnia 13.08.2026) na nowy typ blog-article z internationalized-blog-article
     - `npm run migrate:prod-data` (`scripts/migrate-prod-data.js`, obsluguje `--dry-run`, jest idempotentny)
     - generuje slug, meta title/description i JSON-LD, a na koncu czysci stare pola z dokumentu `BlogArticle`
     - ten sam skrypt zaklada tez produkty (katalog z zywego Stripe, tlumaczenia pl + uk) - patrz sekcja deploy
   - [x] - sprzatanie mediow w buckecie - cel: zaden obiekt w buckecie nie moze zostac osierocony
     - [x] - NIE robimy tego prisma extensionami (zrezygnowalismy - za dziurawe: nie lapia `$runCommandRaw`/bezposredniego dostepu do Mongo ani zmian w `$transaction`, dzialaja per-model)
     - [x] - potrzebny zestaw utilsow (jesli jeszcze nie istnieje) gwarantujacy brak osieroconych plikow, wspolny dla wszystkich modeli z `mediaIds` (blog, produkty, kolejne):
       - [x] - helper do jawnego sprzatania mediow wolany w miejscach mutacji (po commit) - usuwa pliki przy delete rekordu i przy podmianie `mediaIds` na nowe
         - `cleanupMedia()` w `$shared/server/functions/media-cleanup.ts`, wolany w `admin-blog.remote.ts` i `admin-products.remote.ts`
       - [x] - reconciliation sweep (cron) jako wlasciwa gwarancja: wylistuj obiekty w buckecie, odejmij wszystkie `mediaIds` referowane w bazie, skasuj nieuzywane starsze niz grace period (lapie tez raw/`$transaction`/cascade/crash/zmiany z zewnatrz)
         - `reconcileBucket()` + endpoint `POST /api/cron/media-sweep` (bearer `CRON_SECRET`, `?dryRun=1`, domyslny grace period 24h)
       - [x] - guard na wspoldzielone media: nie kasowac pliku wciaz referowanego przez inny rekord
         - `cleanupMedia()` przed kasowaniem odpytuje baze o wszystkie `mediaIds` (`collectReferencedMediaIds()`)

4. Panel admina:
   - [x] - dodac sekcje sklep ktora umozliwi tworzenie definicji produktow (we wszystkich wspieranych jezykach), waluta zawsze ta sama (PLN) (przechowywana wartosc zawsze w groszach, wartosci calkowite) - produkty nie beda juz tworzone w stripe tylko w panelu admina a stripe bedzie tylko obslugiwal checkout
     - `/admin/shop` + `AdminProductForm`; cena wpisywana w zlotowkach, trzymana jako `Int` w groszach
     - produkt ma `siteLocations` (`shop` / `registrations`), wiec konsultacje i sklep sa zarzadzane w jednym miejscu, a cennik pokazuje jedno i drugie
     - [x] - zasada: wszystkie produkty istnieja w naszej bazie; Stripe uzywany tylko i wylacznie do tworzenia checkoutow (zadnych produktow/cen trzymanych w Stripe)
       - `checkout.remote.ts` buduje sesje z inline `price_data`, nazwa produktu jedzie w metadanych (webhook czyta ja stamtad)
   - [x] - w sekcji blog i artykuly dodac mozliwosc internacjonalizacji tych artykulow (per obslugiwany jezyk, dynamicznie) - kazdy taki artykul jest obslugiwany osobno, tj. blog-article zawiera podobiekty pl i uk (klucze a wartoscia jest obiekt z tytulem i opisem) (przynajmniej narazie) wraz z metadata (w JSON-LD) generowanymi tylko przy update i kreacji artykulow
     - JSON-LD budowany w `buildArticleJsonLD()` wylacznie przy zapisie, nigdy przy renderowaniu
     - [x] - pola SEO artykulu osobno per jezyk (PL i UK): meta title (~60 znakow), meta description (~155 znakow), slug (URL), alt obrazka wyrozniajacego
     - [x] - slug: male litery, myslniki, bez znakow diakrytycznych i spacji, po angielsku
       - `slugify()` transliteruje tez cyrylice; slug podpowiada sie z tytulu, dopoki nie zostanie recznie zmieniony
     - [x] - dopuscic artykul tylko w jednym jezyku (nie wymuszac obu wersji)

5. Blog - strona artykulu (frontend) (wg PDF pkt 4):
   - [x] - kazda wersja jezykowa pod wlasnym URL: `/pl/blog/slug` i `/uk/blog/slug`, polaczone znacznikami hreflang (pl, uk, x-default)
     - slug jest per jezyk (`InternationalizedBlogArticle.slug`), a `getBlogArticle` zwraca slugi pozostalych wersji do hreflang
   - [x] - artykul renderuje wlasne meta przez `<svelte:head>` zaleznie od jezyka + dane strukturalne Article (JSON-LD): tytul, data, autor: Olesya Haiduk
   - [x] - wyrazny przycisk kontaktu na stronie kazdego artykulu, kierujacy do sekcji kontaktu / strony konsultacji (`/registrations`)
     - [x] - etykieta zalezna od jezyka: PL "Skontaktuj się ze mną", UK "Зв'яжіться зі мною"
     - [x] - umiescic na koncu artykulu (opcjonalnie dodatkowo sticky) - zrobione oba

6. Pelna lokalizacja - usunac mieszanke jezykowa (wg PDF pkt 5):
   - [x] - po przelaczeniu na PL lub UK cala strona ma byc spojnie w jednym jezyku (teraz czesc UI zostaje w innym)
     - jezyk wynika z URL-a, a nie z localStorage, wiec SSR i klient nigdy sie nie rozjezdzaja
   - [x] - przejrzec wszystkie strony i elementy pod katem resztek innego jezyka
   - [x] - zlokalizowac tez elementy latwe do przeoczenia: naglowki i podpisy sekcji, przyciski, etykiety i placeholdery formularzy, komunikaty (np. potwierdzenie wyslania formularza), menu, stopka, teksty bledow
     - dorzucone `user.a11y.*` (alty, aria-label), `user.pages.error.*` (nowa strona bledu) i `api.errors.*`
   - [x] - wszystkie teksty trzymac w slownikach tlumaczen (PL i UK), zero tekstu hardcoded w kodzie
     - panel admina celowo zostaje po polsku (jeden uzytkownik), przelacznik jezyka zostal z niego usuniety
   - [x] - potwierdzic ze domyslnym jezykiem jest polski

7. Cennik i nazwy uslug w dwoch jezykach (wg PDF pkt 6):
   - [x] - przetlumaczyc strone cennika (`/price-list`) na PL i UK: naglowki, nazwy pozycji, opisy, waluta/kwoty w spojnym formacie
     - pozycje cennika pochodza z naszej bazy w jezyku strony; kwoty formatowane przez `Intl.NumberFormat` (`formatMoney`)
   - [x] - przetlumaczyc nazwy i opisy wszystkich uslug (pary, kobiety, depresja i lęk, LGBTQ+, rodzice, zaburzenia odżywiania) na PL i UK
   - [x] - nazwy uslug maja brzmiec naturalnie w kazdym jezyku (nie tlumaczenie maszynowe) i zawierac szukane frazy (np. "Psychoterapia par", "Terapia dla kobiet")
   - [x] - te same nazwy stosowac spojnie wszedzie: strona glowna, cennik, strony/sekcje uslug, menu

8. og:image / twitter:image - podglad linku (wg PDF pkt 7):
   - [x] - ustawic `og:image` oraz `twitter:image` na wlasny obrazek strony (nie domyslny/angielski)
   - [x] - og:image/twitter:image generowane AUTOMATYCZNIE per strona i artykul, bez recznego podkladania screenshotow za kazdym razem:
     - [x] - endpoint renderujacy obraz w locie (np. route SvelteKit `/og/...` z satori + resvg lub @vercel/og), szablon z tytulem strony/artykulu, marka i jezykiem (pl/uk)
       - `GET /og/[lang].png?title=...&subtitle=...` (satori + @resvg/resvg-js), fonty Roboto (latin + latin-ext + cyrylica) wbudowane w bundle
     - [x] - obraz cache'owany (klucz np. slug + jezyk), regeneracja przy zmianie tytulu/meta
       - tytul jest czescia URL-a, wiec zmiana meta = nowy URL; odpowiedz leci z `cache-control: immutable` + cache w pamieci procesu
     - [x] - fallback na statyczny obrazek marki, gdy brak danych do wygenerowania (redirect na `/site-preview.jpeg`)
   - [x] - obrazek dopasowany do jezyka strony i marki (logo Bezstresowo lub zdjecie z gabinetu, spojne wizualnie)
   - [x] - zalecany rozmiar 1200 x 630 px, format JPG lub PNG, plik hostowany na wlasnej domenie
   - [x] - uzupelnic tez `og:title` i `og:description` dla podgladu (zgodne z jezykiem strony, jak w pkt 2)
   - [ ] - po zmianie odswiezyc podglad w walidatorach (Facebook Sharing Debugger) i w komunikatorze - miniatury bywaja cache'owane
     - do zrobienia recznie po deployu na produkcje

9. Poprawki po audycie z 14.08.2026:
   - [x] - dynamiczny sitemap.xml + wpis w robots.txt (stary statyczny plik listowal URL-e sprzed prefixow jezykowych)
     - `GET /sitemap.xml` (`src/routes/sitemap.xml/+server.ts`) liczony w runtime z bazy - artykuly publikowane z panelu admina wpadaja bez redeployu; odpowiedz cache'owana 1h
     - strony statyczne x pl/uk oraz kazda wersja jezykowa artykulu (slug per jezyk, `lastmod` z `updatedAt`), z alternatywami `xhtml:link` hreflang + x-default - tak samo jak na stronach
     - strony `noindex` (gdpr, regulamin, strony wyniku platnosci) celowo poza sitemapa
     - `static/sitemap.xml` usuniety (zaslanial route), `static/robots.txt` dostal linie `Sitemap:`
   - [x] - maile do klienta wysylane w jezyku, ktorego uzywal na stronie (maile do wlascicielki zostaja po polsku)
     - formularz kontaktowy: `lang` w `ContactRequestDto` (i w `RegistrationRequestDto`), klient przekazuje jezyk biezacej strony
     - platnosci: `lang` (prefix `pl`/`uk`) jedzie w metadata sesji Stripe, webhook czyta go przy potwierdzeniu konsultacji i zakupu; stare sesje bez `lang` -> fallback na polski
     - szablony `*-user.html` sparametryzowane placeholderami `{{ t... }}`, wszystkie teksty i tematy maili klienta w slownikach `api.emails.*` (PL i UK)
   - [x] - captcha (Cloudflare Turnstile - darmowa, bez limitow, przyjazna RODO) na formularzu kontaktowym, za feature flaga w kodzie
     - flaga `CONTACT_FORM_CAPTCHA_ENABLED` w `src/shared/global/config/feature-flags.ts` - domyslnie WYLACZONA (widget ani skrypt nie laduja sie wcale)
     - po wlaczeniu: widget nad przyciskiem wysylki (jezyk widgetu = jezyk strony), token weryfikowany server-side w `sendContactRequest` (fail-closed przy braku sekretu), blad jako `api.contact.errors.captcha`
     - wymaga `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (patrz `.env.example`)
   - [x] - resztka lokalizacji: sr-only "Loading..." w ContactForm przeniesione do slownikow (`user.a11y.loading`)
   - [ ] - wlaczenie captchy (do decyzji): zalozyc darmowe konto Cloudflare Turnstile, wpisac klucze w env i przestawic flage na `true`

---

## Do zrobienia przy deployu

- ustawic `PUBLIC_SITE_URL` (canonical / hreflang / og:image) oraz `CRON_SECRET` (media sweep) - patrz `.env.example`
- odpalic `npm run migrate:prod-data` (najpierw `--dry-run`) na bazie produkcyjnej - migruje stare artykuly
  i zaklada produkty (6 terapii + konsultacja z cennika, tlumaczenia pl + uk, ceny z zywego Stripe)
- po migracji zweryfikowac produkty w `/admin/shop` - Stripe nie jest juz zrodlem produktow ani cen
- harmonogram media-sweep: `vercel.json` juz definiuje cron (GET, codziennie 03:00 UTC) - wystarczy `CRON_SECRET` w env
- zglosic `https://bezstresowo.org/sitemap.xml` w Google Search Console (przyspieszy przeindeksowanie URL-i `/pl/` i `/uk/`)
- przy wlaczaniu captchy: klucze Turnstile w env + flaga `CONTACT_FORM_CAPTCHA_ENABLED` na `true`
