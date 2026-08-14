1. Zmiany jezykowe:
   - [ ] - wylaczyc jezyk angielski
     - [ ] - usunac angielski z przelacznika jezyka (LanguageSelect)
     - [ ] - usunac lub przekierowac stare URL-e wersji angielskiej, zeby wypadly z indexu Google
   - [ ] - zmienic pliki `*.json` na `*.ts`
   - [ ] - domyslna wersja jezykowa to polski
   - [ ] - prefixowac cala strone `/pl/` lub `/uk/` w zaleznosci od wybranego jezyka
   - [ ] - html lang attr ustawiac automatycznie
   - [ ] - dodac hreflang na kazda strone:
     ```html
     <link rel="alternate" hreflang="pl" href="https://bezstresowo.org/pl/home" />
     <link rel="alternate" hreflang="uk" href="https://bezstresowo.org/uk/home" />
     <link rel="alternate" hreflang="x-default" href="https://bezstresowo.org/pl/home" />
     ```
2. Zmiany SEO:
   - [ ] - usunac statyczne `title` i `description` na rzecz generowanych dynamicznie i per strona
     - [ ] - konkretnie usunac z `src/app.html` (zostawic charset, viewport, fonty, favicon)
     - [ ] - meta ustawiac per strona przez `<svelte:head>`, per jezyk (uzyc istniejacego mechanizmu tlumaczen, dodac sekcje meta do slownikow)
     - [ ] - limity dlugosci: title do ~60 znakow, description do ~155
   - [ ] - opisy `og:` i `twitter:` - to samo - generowane per jezyk
   - [ ] - wartosci meta (format: `sciezka` -> `title` -> `description`):
     - [ ] pl:
       - [ ] `/home` -> `Psychoterapeuta Łódź | Bezstresowo - Olesya Haiduk` -> `Psychoterapia dla kobiet, par i młodzieży w Łodzi oraz online. Olesya Haiduk, analiza transakcyjna. Wsparcie z empatią i zrozumieniem. Umów wizytę.`
       - [ ] `/registrations` -> `Umów konsultację psychoterapeutyczną | Łódź i online` -> `Zapisz się na konsultację u Olesyi Haiduk. Terapia indywidualna, par i młodzieży, w gabinecie w Łodzi lub online. Sprawdź dostępne terminy.`
       - [ ] `/blog` -> `Blog o zdrowiu psychicznym i relacjach | Bezstresowo` -> `Artykuły psychoterapeutki o relacjach, emocjach, lęku i poczuciu własnej wartości. Praktyczna wiedza o zdrowiu psychicznym. Łódź i online.`
       - [ ] `/price-list` -> `Cennik psychoterapii | Łódź i online | Bezstresowo` -> `Cennik sesji psychoterapii indywidualnej, dla par i młodzieży. Konsultacje w gabinecie w Łodzi oraz online. Sprawdź ceny i umów wizytę.`
       - [ ] `/shop` -> `Sklep | Materiały wspierające dobrostan | Bezstresowo` -> `Materiały psychoedukacyjne i produkty wspierające zdrowie psychiczne. Bezstresowo, Olesya Haiduk, psychoterapia w Łodzi i online.`
       - [ ] `/terms-of-service` -> `Regulamin | Bezstresowo` -> `noindex`
       - [ ] `/gdpr` -> `Polityka prywatności (RODO) | Bezstresowo` -> `noindex`
     - [ ] uk:
       - [ ] `/home` -> `Психотерапевт Лодзь | Bezstresowo - Олеся Гайдук (Olesya Haiduk)` -> `Психотерапія для жінок, пар і підлітків у Лодзі та онлайн. Олеся Гайдук (Olesya Haiduk), транзакційний аналіз. Підтримка з емпатією. Запишіться.`
       - [ ] `/registrations` -> `Запис на консультацію психотерапевта | Лодзь, онлайн` -> `Запишіться на консультацію до Олесі Гайдук (Olesya Haiduk). Індивідуальна терапія, для пар і підлітків, у кабінеті в Лодзі або онлайн.`
       - [ ] `/blog` -> `Блог про психічне здоров'я та стосунки | Bezstresowo` -> `Статті психотерапевтки про стосунки, емоції, тривогу та самооцінку. Практичні знання про психічне здоров'я. Лодзь та онлайн.`
       - [ ] `/price-list` -> `Ціни на психотерапію | Лодзь і онлайн | Bezstresowo` -> `Вартість сесій індивідуальної психотерапії, для пар і підлітків. Консультації в кабінеті в Лодзі та онлайн. Перегляньте ціни й запишіться.`
       - [ ] `/shop` -> `Магазин | Матеріали для добробуту | Bezstresowo` -> `Психоедукаційні матеріали та продукти для підтримки психічного здоров'я. Bezstresowo, Олеся Гайдук, психотерапія в Лодзі та онлайн.`
       - [ ] `/terms-of-service` -> `Правила користування | Bezstresowo` -> `noindex`
       - [ ] `/gdpr` -> `Політика конфіденційності | Bezstresowo` -> `noindex`
   - [ ] - wartosci meta dla uslug (ZABLOKOWANE - wszystkie uslugi sa sekcjami na tej samej stronie `/home`, wiec nie da sie ustawic osobnego title/description per usluga):
     - propozycja: zeby uzyskac osobne meta + hreflang per usluga, kazda usluga musi miec wlasny, indeksowalny URL (np. `/uslugi/pary`, `/uslugi/kobiety`). Kotwice (`#pary`) nie zadzialaja - Google indeksuje jeden URL na strone. Trzeba by zrobic osobne podstrony (landing page) per usluga. Do decyzji.
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
   - [ ] - przelaczyc svelte-kit na `*.remote.ts` oraz `await` w komponentach (optymalistyczne update-y) tak jak zostalo to przedstawione w tym repo -> https://github.com/Szymonexis/sveltekit-remote-example
   - [ ] - stworzyc jakis skrypt migracyjny ktory pozwoli na przelozenie istniejacych blog-articles (wszystkie istniejace artykuly sa napisane w jezyku polskim) (sprzed zmian z dnia 13.08.2026) na nowy typ blog-article z internationalized-blog-article
   - [ ] - sprzatanie mediow w buckecie - cel: zaden obiekt w buckecie nie moze zostac osierocony
     - [ ] - NIE robimy tego prisma extensionami (zrezygnowalismy - za dziurawe: nie lapia `$runCommandRaw`/bezposredniego dostepu do Mongo ani zmian w `$transaction`, dzialaja per-model)
     - [ ] - potrzebny zestaw utilsow (jesli jeszcze nie istnieje) gwarantujacy brak osieroconych plikow, wspolny dla wszystkich modeli z `mediaIds` (blog, produkty, kolejne):
       - [ ] - helper do jawnego sprzatania mediow wolany w miejscach mutacji (po commit) - usuwa pliki przy delete rekordu i przy podmianie `mediaIds` na nowe
       - [ ] - reconciliation sweep (cron) jako wlasciwa gwarancja: wylistuj obiekty w buckecie, odejmij wszystkie `mediaIds` referowane w bazie, skasuj nieuzywane starsze niz grace period (lapie tez raw/`$transaction`/cascade/crash/zmiany z zewnatrz)
       - [ ] - guard na wspoldzielone media: nie kasowac pliku wciaz referowanego przez inny rekord

4. Panel admina:
   - [ ] - dodac sekcje sklep ktora umozliwi tworzenie definicji produktow (we wszystkich wspieranych jezykach), waluta zawsze ta sama (PLN) (przechowywana wartosc zawsze w groszach, wartosci calkowite) - produkty nie beda juz tworzone w stripe tylko w panelu admina a stripe bedzie tylko obslugiwal checkout
     - [ ] - zasada: wszystkie produkty istnieja w naszej bazie; Stripe uzywany tylko i wylacznie do tworzenia checkoutow (zadnych produktow/cen trzymanych w Stripe)
   - [ ] - w sekcji blog i artykuly dodac mozliwosc internacjonalizacji tych artykulow (per obslugiwany jezyk, dynamicznie) - kazdy taki artykul jest obslugiwany osobno, tj. blog-article zawiera podobiekty pl i uk (klucze a wartoscia jest obiekt z tytulem i opisem) (przynajmniej narazie) wraz z metadata (w JSON-LD) generowanymi tylko przy update i kreacji artykulow
     - [ ] - pola SEO artykulu osobno per jezyk (PL i UK): meta title (~60 znakow), meta description (~155 znakow), slug (URL), alt obrazka wyrozniajacego
     - [ ] - slug: male litery, myslniki, bez znakow diakrytycznych i spacji, po angielsku
     - [ ] - dopuscic artykul tylko w jednym jezyku (nie wymuszac obu wersji)

5. Blog - strona artykulu (frontend) (wg PDF pkt 4):
   - [ ] - kazda wersja jezykowa pod wlasnym URL: `/pl/blog/slug` i `/uk/blog/slug`, polaczone znacznikami hreflang (pl, uk, x-default)
   - [ ] - artykul renderuje wlasne meta przez `<svelte:head>` zaleznie od jezyka + dane strukturalne Article (JSON-LD): tytul, data, autor: Olesya Haiduk
   - [ ] - wyrazny przycisk kontaktu na stronie kazdego artykulu, kierujacy do sekcji kontaktu / strony konsultacji (`/registrations`)
     - [ ] - etykieta zalezna od jezyka: PL "Skontaktuj się ze mną", UK "Зв'яжіться зі мною"
     - [ ] - umiescic na koncu artykulu (opcjonalnie dodatkowo sticky)

6. Pelna lokalizacja - usunac mieszanke jezykowa (wg PDF pkt 5):
   - [ ] - po przelaczeniu na PL lub UK cala strona ma byc spojnie w jednym jezyku (teraz czesc UI zostaje w innym)
   - [ ] - przejrzec wszystkie strony i elementy pod katem resztek innego jezyka
   - [ ] - zlokalizowac tez elementy latwe do przeoczenia: naglowki i podpisy sekcji, przyciski, etykiety i placeholdery formularzy, komunikaty (np. potwierdzenie wyslania formularza), menu, stopka, teksty bledow
   - [ ] - wszystkie teksty trzymac w slownikach tlumaczen (PL i UK), zero tekstu hardcoded w kodzie
   - [ ] - potwierdzic ze domyslnym jezykiem jest polski

7. Cennik i nazwy uslug w dwoch jezykach (wg PDF pkt 6):
   - [ ] - przetlumaczyc strone cennika (`/price-list`) na PL i UK: naglowki, nazwy pozycji, opisy, waluta/kwoty w spojnym formacie
   - [ ] - przetlumaczyc nazwy i opisy wszystkich uslug (pary, kobiety, depresja i lęk, LGBTQ+, rodzice, zaburzenia odżywiania) na PL i UK
   - [ ] - nazwy uslug maja brzmiec naturalnie w kazdym jezyku (nie tlumaczenie maszynowe) i zawierac szukane frazy (np. "Psychoterapia par", "Terapia dla kobiet")
   - [ ] - te same nazwy stosowac spojnie wszedzie: strona glowna, cennik, strony/sekcje uslug, menu

8. og:image / twitter:image - podglad linku (wg PDF pkt 7):
   - [ ] - ustawic `og:image` oraz `twitter:image` na wlasny obrazek strony (nie domyslny/angielski)
   - [ ] - og:image/twitter:image generowane AUTOMATYCZNIE per strona i artykul, bez recznego podkladania screenshotow za kazdym razem:
     - [ ] - endpoint renderujacy obraz w locie (np. route SvelteKit `/og/...` z satori + resvg lub @vercel/og), szablon z tytulem strony/artykulu, marka i jezykiem (pl/uk)
     - [ ] - obraz cache'owany (klucz np. slug + jezyk), regeneracja przy zmianie tytulu/meta
     - [ ] - fallback na statyczny obrazek marki, gdy brak danych do wygenerowania
   - [ ] - obrazek dopasowany do jezyka strony i marki (logo Bezstresowo lub zdjecie z gabinetu, spojne wizualnie)
   - [ ] - zalecany rozmiar 1200 x 630 px, format JPG lub PNG, plik hostowany na wlasnej domenie
   - [ ] - uzupelnic tez `og:title` i `og:description` dla podgladu (zgodne z jezykiem strony, jak w pkt 2)
   - [ ] - po zmianie odswiezyc podglad w walidatorach (Facebook Sharing Debugger) i w komunikatorze - miniatury bywaja cache'owane
