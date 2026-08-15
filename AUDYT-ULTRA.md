# Audyt ultra — 15.08.2026

Drugie, **niezależne** review całego brancha względem `origin/master` (169 plików,
29 commitów). Robione od zera, bez zakładania, że `AUDYT.md` ma rację — część jego
tez sprawdzam i potwierdzam, do kilku mam zastrzeżenia (sekcja na końcu).

Metoda: siedmiu osobnych recenzentów puszczonych równolegle na ten sam diff
(bezpieczeństwo, płatności, i18n/routing, dane i migracja, remote functions,
SEO/media, build i konfiguracja). Wszystko, co poniżej ma etykietę
**[potwierdzone]**, prześledziłem następnie sam w kodzie — czytając pełne pliki,
nie same hunki diffa; przy dwóch najpoważniejszych punktach dodatkowo sprawdziłem
zachowanie empirycznie. Co dokładnie dobiegło do końca, opisuję w sekcji
„Metodologia" na końcu.

## Stan techniczny

| Sprawdzenie                        | Wynik                     |
| ---------------------------------- | ------------------------- |
| `svelte-check`                     | **0 błędów, 0 ostrzeżeń** |
| `npm run lint` (prettier + eslint) | czysto                    |
| `vite build`                       | przechodzi                |

Uwaga do `npm run check`: na świeżym klonie wywala **22 błędy**, wszystkie fałszywe
— to tylko brak wygenerowanego klienta Prisma. Skrypt robi `svelte-kit sync`, ale
nie `prisma generate`. Szczegóły w N-6.

## TL;DR

Kod jest w dobrym stanie — architektura remote functions jest spójna, autoryzacja
admina szczelna, captcha faktycznie fail-closed, sitemap i hreflang zrobione
porządnie. Ale **są cztery rzeczy, które trzeba naprawić zanim to pójdzie na
produkcję**:

- pierwszy deploy **nie zbuduje się w ogóle** — brakuje nowej zmiennej
  `AWS_S3_ENDPOINT` (B-1),
- płatności z ukraińskiej wersji strony padają po stronie Stripe (B-2),
- cron może nieodwracalnie skasować zdjęcia bloga z S3 (B-3),
- przełącznik języka 404-uje na każdym artykule (B-4).

B-1 zatrzyma wdrożenie na etapie budowania, a B-2 oznacza, że nawet po udanym
deployu **ukraińska połowa strony nie przyjmie ani złotówki**.

---

## Blokery — do naprawy przed deployem

### B-1 [krytyczny] Pierwszy deploy tej gałęzi wywali się na buildzie — brakuje `AWS_S3_ENDPOINT` w środowisku

**[potwierdzone eksperymentalnie]** `src/shared/server/services/s3/s3-service.ts:4`

Branch dokłada `AWS_S3_ENDPOINT` do importu z `$env/static/private`. Na `origin/master`
tej zmiennej **nie ma w ogóle** — sprawdziłem, `git show origin/master:...` importuje
tylko cztery pozostałe `AWS_S3_*`. A `$env/static/private` w SvelteKicie rozwiązuje
się w czasie builda: import zmiennej, której nie ma w środowisku, to twardy błąd
kompilacji, nie ostrzeżenie.

Uruchomiłem build z odpiętą zmienną i dostałem dokładnie to:

```
src/shared/server/services/s3/s3-service.ts (4:1): "AWS_S3_ENDPOINT" is not exported
by "virtual:env/static/private", imported by "src/shared/server/services/s3/s3-service.ts".
```

Skoro istniejący projekt na Vercelu ma ustawione `AWS_S3_ACCESS_KEY_ID`,
`AWS_S3_BUCKET_NAME`, `AWS_S3_REGION` i `AWS_S3_SECRET_ACCESS_KEY` (bo S3 działało
już na masterze), ale **nie ma `AWS_S3_ENDPOINT`** — pierwszy deploy tej gałęzi
padnie na etapie budowania, zanim jeszcze cokolwiek innego zdąży się wydarzyć.

Dwie rzeczy dodatkowo pogarszają sprawę:

- Checklista w `AUDYT.md` wymienia tylko `CRON_SECRET` i `PUBLIC_SITE_URL` jako
  zmienne do dodania. O `AWS_S3_ENDPOINT` nie wspomina.
- `.env.example` opisuje ją jako `AWS_S3_ENDPOINT="" # leave empty for AWS S3`,
  co czyta się jak „przy AWS możesz pominąć". Pominięcie łamie build; **pusta
  wartość jest w porządku**, bo pusty string to nadal ustawiona zmienna.

**Fix — natychmiastowy:** dodać `AWS_S3_ENDPOINT` do zmiennych środowiskowych
Vercela (pustą wartością, jeśli używacie zwykłego AWS S3), zanim ruszy deploy.

**Fix — kodowy (żeby to nie było miną):** ta zmienna jest z natury opcjonalna,
więc powinna iść przez `$env/dynamic/private`, które zwraca `undefined` zamiast
wywracać build:

```ts
import { env } from '$env/dynamic/private';
// ...
...(env.AWS_S3_ENDPOINT ? { endpoint: env.AWS_S3_ENDPOINT, forcePathStyle: true } : {})
```

### B-2 [krytyczny] Każda płatność z ukraińskiej wersji strony padnie — Stripe nie obsługuje locale `uk`

**[potwierdzone]** `src/remote/checkout.remote.ts:121`

```ts
function stripeLocale(lang: Locale): Stripe.Checkout.SessionCreateParams.Locale {
	return LOCALE_PREFIXES[lang] as Stripe.Checkout.SessionCreateParams.Locale;
}
```

`LOCALE_PREFIXES` zwraca `'pl'` albo `'uk'`. Rzutowanie `as` wycisza TypeScript,
ale Stripe waliduje `locale` po swoim enumie — a **ukraiński nie jest wspierany**
w Stripe Checkout. Sprawdziłem w typach zainstalowanego SDK
(`node_modules/stripe/types/Checkout/SessionsResource.d.ts:841`): union zawiera
`'pl'` i `'ru'`, natomiast `'uk'` nie występuje ani razu.

Skutek: `stripe.checkout.sessions.create({ locale: 'uk', ... })` zwraca błąd 400,
czyli **ani zapis na konsultację, ani zakup w sklepie nie zadziała z `/uk/...`** —
dotyczy obu ścieżek (`createRegistrationCheckout` i `createShopCheckout`).
Połowa strony nie przyjmie ani złotówki.

Dodatkowo: to samo rzutowanie `as` sprawia, że dodanie kolejnego języka
w przyszłości cicho powtórzy ten sam błąd.

**Fix** — zmapować język strony na locale, które Stripe rozumie, zamiast rzutować:

```ts
const STRIPE_LOCALES = {
	[Locale.plPL]: 'pl',
	[Locale.ukUA]: 'auto' // Stripe nie ma ukraińskiego; 'auto' pójdzie za przeglądarką
} as const satisfies Record<Locale, Stripe.Checkout.SessionCreateParams.Locale>;

function stripeLocale(lang: Locale) {
	return STRIPE_LOCALES[lang];
}
```

`'auto'` jest tu lepsze niż `'ru'` — z oczywistych względów nie chcemy podstawiać
rosyjskiego ukraińskim klientom. `satisfies` zamiast `as` sprawi, że przy dodaniu
języka TypeScript sam się upomni.

Warto potwierdzić testową płatnością z `/uk/registrations` na kluczach testowych.

### B-3 [krytyczny] Cron media-sweep skasuje zdjęcia starych artykułów, jeśli odpali się przed migracją

**[potwierdzone]** `src/shared/server/functions/media-cleanup.ts:23`

```ts
const MEDIA_OWNERS = [
	() => prisma.internationalizedBlogArticle.findMany({ select: { mediaIds: true } }),
	() => prisma.internationalizedProduct.findMany({ select: { mediaIds: true } })
] as const;
```

Zestaw „nie kasować" budowany jest **wyłącznie z nowych kolekcji**. Tymczasem
stare artykuły trzymają `mediaIds` bezpośrednio na dokumencie `BlogArticle` —
migracja czyta je surowo (`$runCommandRaw`), bo tych pól nie ma już w schemacie
(`scripts/migrate-prod-data.js:216-222`). Do czasu uruchomienia migracji te
identyfikatory są dla `collectReferencedMediaIds()` niewidoczne.

Scenariusz, który realnie się wydarzy przy tej kolejności wdrożenia:

1. Deploy na Vercel (build sam robi `prisma db push`).
2. Vercel Cron uderza w `/api/cron/media-sweep` o **03:00 UTC** (`vercel.json`).
3. Sweep listuje bucket, odejmuje referencje — których jeszcze nie ma — i kasuje
   wszystko starsze niż 24 h. Stare zdjęcia bloga mają lata, więc grace period
   ich nie uratuje.
4. Rano uruchamiasz migrację. Artykuły dostają `mediaIds` wskazujące na pliki,
   **których już nie ma w S3**.

To jest kasowanie nieodwracalne. `AUDYT.md` ustawia migrację jako ręczny krok
_po_ deployu, więc to okno jest domyślną ścieżką, a nie pechowym zbiegiem
okoliczności.

**Fix — kolejność (obowiązkowo):** uruchomić migrację **bezpośrednio po deployu,
przed pierwszym przejściem crona**. Najbezpieczniej: zanim ruszysz cokolwiek,
odpal sweep w trybie podglądu i zobacz, co planuje skasować:

```sh
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://bezstresowo.org/api/cron/media-sweep?dryRun=1"
```

Jeśli `orphaned` jest niezerowe, a migracja jeszcze nie poszła — nie dopuszczaj
do przejścia crona.

**Fix — kod (żeby to nie zależało od kolejności):** dopisać legacy do
`MEDIA_OWNERS`, dopóki migracja nie jest wykonana wszędzie:

```ts
async function legacyBlogMediaIds(): Promise<{ mediaIds: string[] }[]> {
	const found = await prisma.$runCommandRaw({
		find: 'BlogArticle',
		filter: { mediaIds: { $exists: true } },
		batchSize: 1000
	});

	return (found?.cursor?.firstBatch ?? []).map((row) => ({
		mediaIds: Array.isArray(row.mediaIds) ? row.mediaIds.map(String) : []
	}));
}
```

**Fix — bezpiecznik (mocno zalecany):** `reconcileBucket` nie ma żadnego progu
zdrowego rozsądku. Jeśli baza kiedykolwiek odpowie pusto (zła `DATABASE_URL`,
świeża baza, pomyłka w env) — sweep skasuje **cały bucket** i to bez ostrzeżenia.
Wart dopisania warunek w stylu „jeśli mam skasować więcej niż połowę obiektów
albo baza nie zwróciła ani jednej referencji, przerwij i zaloguj":

```ts
if (referenced.size === 0 && objects.length > 0) {
	console.error('[media-sweep] zero references in db - refusing to delete');
	return { ...report, deleted: [] };
}
```

### B-4 [wysoki] Przełącznik języka wyrzuca 404 na każdej stronie artykułu

**[potwierdzone]** `src/lib/LanguageSelect/LanguageSelect.svelte:23`

```ts
const target = `/${LOCALE_PREFIXES[locale]}${stripLocalePrefix(page.url.pathname)}${page.url.search}`;
```

Przełącznik podmienia prefiks i **zostawia resztę ścieżki bez zmian**. Tymczasem
slug artykułu jest inny w każdym języku — to celowa decyzja, zapisana wprost
w schemacie (`prisma/internationalized-blog-article.prisma:7`: „Per-language URL:
`/pl/blog/<slug>` and `/uk/blog/<slug>` are distinct pages") i wymuszona przez
`@unique` na `slug`.

Czyli: użytkownik czyta `/pl/blog/jak-radzic-sobie-z-lekiem`, przełącza na
ukraiński, ląduje na `/uk/blog/jak-radzic-sobie-z-lekiem` — a ukraińska wersja ma
slug transliterowany z cyrylicy, np. `/uk/blog/yak-podolaty-tryvohu`. Efekt: 404
zamiast tłumaczenia artykułu.

Co ciekawe, w kodzie **jest już wszystko, czego trzeba** — warstwa SEO ten problem
rozwiązuje poprawnie. `src/lib/Seo/model.ts:17-22` pisze wprost:

> Defaults to the current path in every supported language, which is correct for
> everything except blog articles, whose slug differs per language.

a strona artykułu przekazuje prawidłowe `alternates` z `post.alternates`
(`src/routes/[lang=lang]/blog/[slug]/+page.svelte:41-44`). Przeoczenie dotyczy
wyłącznie przełącznika, który tej wiedzy nie używa.

**Fix:** udostępnić `alternates` przełącznikowi (np. przez kontekst ustawiany
przez `Seo.svelte` albo `page.data`) i przy przełączaniu preferować dopasowany
wariant, z fallbackiem na obecne zachowanie:

```ts
const alternate = languageVersions.find((candidate) => candidate.locale === locale);
const target = alternate
	? alternateUrl(alternate)
	: `/${LOCALE_PREFIXES[locale]}${stripLocalePrefix(page.url.pathname)}${page.url.search}`;
```

Fallback jest istotny — dla artykułu, który nie ma jeszcze drugiej wersji
językowej, lepiej zejść na `/uk/blog` niż na 404.

---

## Średnie

### S-1 Webhook Stripe potwierdza 200 nawet gdy mail nie poszedł

**[potwierdzone]** `src/routes/api/stripe/webhook/+server.ts:71-77`

```ts
} catch (error) {
	console.error('Error processing stripe webhook:', error);
}
// ...
return text('OK', { status: HttpStatus.OK });
```

Błąd wysyłki maila jest łykany, a Stripe dostaje 200 — czyli **nie ponowi
dostawy**. Klient zapłacił, a powiadomienie o zapisie/zakupie nie dotarło ani do
niego, ani do Ciebie. Jedynym śladem jest wpis w logach Vercela, na który nikt nie
patrzy.

Przy nodemailerze i Gmailu to nie jest teoretyczne: limit wysyłki, chwilowy błąd
SMTP, timeout — i zamówienie przepada po cichu.

**Fix:** zwrócić 500 przy błędzie wysyłki, żeby Stripe ponowił (robi to z
narastającym backoffem przez 3 dni). Wymaga wtedy idempotencji — patrz N-1.

### S-2 JSON-LD wstrzykiwany przez `{@html}` bez ucieczki `</script>`

**[potwierdzone]** `src/lib/Seo/Seo.svelte:82-85`

```svelte
{#if jsonLd}
	<!-- eslint-disable-next-line no-useless-escape -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
{/if}
```

Escape `<\/script>` dotyczy **tylko literału w źródle** — nie chroni tego, co
wstawia `JSON.stringify`. A `JSON.stringify` ucieka `"` i `\`, ale zostawia `<`,
`>` i `/` nietknięte.

Zawartość pochodzi z `metadataJsonLD`, budowanego w `buildArticleJsonLD` z
`metaTitle`/`metaDescription` wpisanych w panelu (`json-ld.ts:36-37`). DTO
ogranicza tylko długość (60/155 znaków), nie zestaw znaków
(`src/remote/dto/blog.ts:34-36`). Wpisanie w meta tytuł ciągu
`</script><script>...</script>` wychodzi z bloku ld+json i wykonuje się
u każdego odwiedzającego artykuł.

Wektor wymaga dostępu do panelu, więc to nie jest dziura na zewnątrz — ale ta
konkretna linijka była pisana z intencją bycia bezpieczną (świadczy o tym komentarz
eslinta) i tej intencji nie realizuje.

**Fix:**

```svelte
{@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}<\/script>`}
```

### S-3 `prisma db push` odpala się przy każdym buildzie na Vercelu

**[potwierdzone]** `package.json:8`

```json
"build": "prisma generate && prisma db push && vite build"
```

Każdy build — również **preview deployment z byle brancha albo z PR-a** —
modyfikuje schemat bazy wskazanej przez `DATABASE_URL` tego środowiska. Jeśli
preview i produkcja dzielą jedną `DATABASE_URL` (a to domyślne zachowanie, gdy
zmienna jest ustawiona na poziomie projektu bez rozbicia na environmenty), to
**build z dowolnego brancha przepisuje schemat produkcji**.

Drugi problem: `db push` przy rozbieżności wymagającej utraty danych zatrzyma się
i wywali build — czyli deploy produkcyjny może paść z powodu stanu bazy, a nie
kodu.

**Fix:** wyprowadzić `db push` z `build` do osobnego, świadomie uruchamianego
kroku (`npm run prisma:db:push`), a w Vercelu ustawić `DATABASE_URL` osobno dla
Production i Preview. Minimum: upewnić się, że środowiska Preview mają własną bazę.

### S-4 Nazwa terapii w mailu bierze się z danych klienta, nie z opłaconego produktu

**[potwierdzone]** `src/remote/checkout.remote.ts:36`

```ts
metadata: {
	type: 'consultation-registration',
	therapyName: dto.therapyName,   // <- prosto od klienta
	// ...
}
```

Produkt jest ładowany serwerowo (`loadProduct`) i to on wyznacza kwotę — więc
**płatność jest naliczana poprawnie**. Ale `therapyName`, które trafia do maila
z powiadomieniem, przechodzi z przeglądarki bez konfrontacji z tym, co faktycznie
zostało kupione. Klient może wysłać dowolny string.

W połączeniu z brakiem escapowania HTML w mailach (S-5 / `AUDYT.md` pkt 3) daje to
wstrzyknięcie dowolnego HTML-a do Twojej skrzynki.

**Fix:** wziąć nazwę z załadowanego tłumaczenia i wyrzucić pole z DTO:

```ts
therapyName: translation.name,
```

### S-5 Brak escapowania HTML w mailach — teraz realniejszy, niż wynika z `AUDYT.md`

**[potwierdzone, znane]** `src/shared/global/functions/html-key-value-replacer.ts:2`

```ts
return html.replace(/{{\s*((\w|\d|-|_)+)\s*}}/g, (_, key) => replacements[key] ?? `{{${key}}}`);
```

Wartość wchodzi surowa. `AUDYT.md` opisuje to poprawnie (pkt 3) i słusznie —
podtrzymuję ocenę. Dopisuję natomiast dwie rzeczy, których tam nie ma:

1. `AUDYT.md` sugeruje, że captcha to ograniczy. Captcha jest **domyślnie
   wyłączona i nie da się jej włączyć z env** — `CONTACT_FORM_CAPTCHA_ENABLED`
   to stała w kodzie (`feature-flags.ts:11`), więc włączenie wymaga commita
   i redeployu. Na dzień deployu formularz jest otwarty.
2. Wektor jest szerszy niż formularz kontaktowy — S-4 dokłada drugą drogę.

**Fix:** escapować w jednym miejscu, w `htmlKeyValueReplacer`:

```ts
const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

return html.replace(/{{\s*((\w|\d|-|_)+)\s*}}/g, (_, key) => {
	const value = replacements[key];
	return value === undefined ? `{{${key}}}` : value.replace(/[&<>"']/g, (char) => ESCAPE[char]);
});
```

Uwaga: `message` jest dziś wstawiane jako HTML celowo (fallback
`<i>Brak wiadomości</i>`), więc przy escapowaniu trzeba ten fallback zamienić na
zwykły tekst — i tak powinien być tłumaczony (`AUDYT.md` pkt 2).

### S-6 Zaseedowane produkty nie przechodzą walidacji własnego panelu

**[potwierdzone]** `scripts/migrate-prod-data.js:367` vs `src/remote/dto/product.ts`

Seed zapisuje `description: ''` dla każdego tłumaczenia, a konsultacji dodatkowo
`siteLocations: []`. Panel wymaga:

- `InternationalizedProductDto.description` — `@MinLength(1)` (`product.ts:45`)
- `UpsertProductDto.siteLocations` — `@ArrayNotEmpty()` (`product.ts:69`)

Skutek: `AUDYT.md` każe po migracji „zweryfikować produkty w `/admin/shop`,
ewentualnie dodać opisy" — ale zapis **odbije się walidacją**, dopóki nie wpiszesz
opisu. To akurat da się odkryć. Gorsze jest to, że
**„Konsultacja psychoterapeutyczna" nie da się zapisać w ogóle**: jest celowo
`siteLocations: []` (ma być tylko na cenniku), a panel nie pozwala zapisać pustej
listy. Żeby cokolwiek w niej zmienić, trzeba jej przypisać lokalizację — czyli
zmienić to, gdzie się pokazuje.

**Fix:** dopuścić pustą listę w DTO (usunąć `@ArrayNotEmpty()`, zostawić
`@IsArray()` + `@IsIn(..., { each: true })`) i dodać w formularzu czytelny opis, że
brak zaznaczenia = „tylko cennik". Opis produktu zrobić opcjonalnym
(`@IsOptional()` zamiast `@MinLength(1)`) albo dopisać treści w seedzie.

### S-7 Usunięcie zdjęcia w edytorze kasuje plik z S3 natychmiast, jeszcze przed zapisem

**[potwierdzone]** `src/lib/TipTap/TipTap.svelte:97-106`

```ts
async onDelete(props) {
	if (props.type === 'node' && (props.node.type.name === 'image' || props.node.type.name === 'video')) {
		const id = props.node.attrs['id'] as string;
		await deleteMedia({ id });
		delete addedMedia[id];
	}
}
```

`deleteMedia` (`src/remote/admin-media.remote.ts:44`) kasuje obiekt z bucketu
**bezwarunkowo** — w przeciwieństwie do `cleanupMedia`, które najpierw sprawdza
`collectReferencedMediaIds()`. Ścieżka edytora omija więc dokładnie tę warstwę
bezpieczeństwa, którą reszta kodu starannie buduje.

Dwa realne scenariusze:

1. Otwierasz opublikowany artykuł, kasujesz zdjęcie w edytorze, po czym
   **zamykasz kartę bez zapisu** (albo zapis się nie udaje). Plik w S3 już nie
   istnieje, a zapisany artykuł nadal ma go w `mediaIds` i w treści HTML →
   na żywej stronie zostaje ikona zepsutego obrazka.
2. Kasujesz zdjęcie i wciskasz **Ctrl+Z**. Węzeł wraca do edytora, plik nie
   wraca do bucketu.

**Fix:** nie kasować z `onDelete`. Wystarczy odnotować id jako „do sprzątnięcia"
i zdać się na istniejący mechanizm — `cleanupMedia` po zapisie wyczyści to, co
faktycznie wypadło z `mediaIds`, a `reconcileBucket` dobierze resztę. Alternatywnie
`deleteMedia` powinno odmawiać kasowania id, które jest jeszcze w bazie
referencjonowane.

### S-8 Formularz zapisu działa przez przypadek — `onchange` rzuca wyjątkiem przy każdym wyborze terapii

**[potwierdzone eksperymentalnie]** `src/routes/[lang=lang]/registrations/model.ts:7`
i `+page.svelte:127-133`

Schema yup wymaga pola `therapyType`, a formularz operuje na `therapyProductId` —
w typie `FormValue`, w wartościach początkowych, w bindingu i w wyświetlaniu błędu
(`$errors.therapyProductId`, linia 150). Wygląda to na rozjazd, który powinien
zabić wysyłkę. **Nie zabija** — i warto wiedzieć dlaczego, bo powód jest kruchy.

Select niesie jednocześnie `name="therapyType"` (linia 129) i `onblur={handleChange}`
(linia 132), a `handleChange` rozwiązuje pole po atrybucie `name`
(`create-form.js:112`: `element.name || element.id`). Przy opuszczeniu selecta
biblioteka dopisuje więc do formularza brakujące `therapyType` — i walidacja
przechodzi. Odtworzyłem pełen cykl na zainstalowanych `yup` i `svelte-forms-lib`:

```
onchange RZUCA (niezłapane w komponencie): The schema does not contain the path: therapyProductId
  errors.therapyProductId = undefined
onblur -> form.therapyType = "507f1f77bcf86cd799439011"
       -> isValid = true => przycisk AKTYWNY
submit -> onSubmit wywołane? true
```

Realne usterki, które z tego zostają:

1. **Przy każdym wyborze terapii leci niezłapany wyjątek.** `onchange` woła
   `updateValidateField('therapyProductId', …)`, a `validateAt` na ścieżce spoza
   schemy rzuca **synchronicznie** — czyli przed zbudowaniem łańcucha `.then/.catch`
   w `validateFieldValue`. Wyjątek wychodzi z handlera do konsoli przeglądarki.
   Użytkownik nic nie widzi, ale każde kliknięcie w listę generuje błąd.
2. **Komunikat „wybierz terapię" jest nieosiągalny.** Błąd `required` ląduje pod
   kluczem `$errors.therapyType`, a szablon renderuje `$errors.therapyProductId`.
   Jeśli ktoś wyśle formularz bez opuszczenia selecta, walidacja odrzuci go
   **bez żadnego komunikatu** (sprawdzone: `onSubmit wywołane? false`,
   `errors = {"therapyType":"req.therapyType", ...}`). W praktyce kliknięcie
   przycisku najpierw zabiera fokus selectowi, więc trafia się na to rzadko.
3. **Całość wisi na atrybucie, który wygląda na kosmetyczny.** Usunięcie
   `name="therapyType"` albo `onblur={handleChange}` — refactor, który każdy
   uzna za bezpieczny — natychmiast zabija zapisy na konsultacje.

**Fix:** ujednolicić nazwę pola. Najprościej w schemie:

```ts
therapyProductId: yup.string().required(`${prefix}.therapyType.errors.required`),
```

i zmienić `name="therapyType"` na `name="therapyProductId"`. Wtedy `onchange`,
`onblur`, walidacja i wyświetlanie błędu mówią o tym samym polu, a komunikat
o niewybranej terapii wreszcie się pokazuje.

---

## Niskie i informacyjne

### N-1 Brak idempotencji webhooka

`src/routes/api/stripe/webhook/+server.ts:37` — Stripe gwarantuje dostawę _co
najmniej raz_, a kod nie zapisuje nigdzie `event.id`. Dziś ponowienia praktycznie
nie występują (bo zawsze zwracamy 200 — S-1), ale po naprawie S-1 duplikaty maili
staną się realne. Fix: kolekcja `ProcessedStripeEvent` z unikalnym `eventId`,
sprawdzana przed wysyłką.

### N-2 Owner dostaje maila z dosłownym `{{ message }}`

`email-templates/shop-buy/shop-buy-owner.html:116` używa placeholdera `message`,
a ścieżka sklepowa w webhooku przekazuje tylko `email`, `tel`, `nameAndSurname`,
`price`, `currency`, `productName` (`webhook/+server.ts:59-67`). Nieznane klucze
`htmlKeyValueReplacer` zostawia jako `{{message}}` — więc w każdym mailu
o zakupie widnieje surowy placeholder. Fix: usunąć sekcję z szablonu (zakup w
sklepie nie ma pola wiadomości) albo przekazywać pusty string.

### N-3 Login admina: SHA-256 bez soli, bez limitu prób

`src/remote/admin-auth.remote.ts:13`. **To nie jest regresja tego brancha** —
sprawdziłem `origin/master:src/routes/api/admin/login/+server.ts`, mechanizm jest
identyczny, branch tylko przeniósł go do remote function. Zgłaszam jako stan
zastany: nieosolony, szybki hash + brak jakiegokolwiek rate limitingu oznacza, że
hasło admina można obstrzeliwać z prędkością sieci. Przy słabym haśle to realna
droga do przejęcia panelu (blog, produkty, media). Fix: bcrypt/argon2 (w
`package.json` jest już `@types/bcrypt` w `dependencies`, ale samego `bcrypt` nie
ma — pozostałość po porzuconym zamiarze) plus prosty licznik prób po IP.

### N-4 JWT trzyma `exp`/`iat` w milisekundach

`src/shared/server/functions/admin-auth.ts:23` zapisuje `exp: now + interval`
w milisekundach, podczas gdy RFC 7519 wymaga sekund. `jwt.verify` porównuje `exp`
z `Date.now()/1000`, więc wartość rzędu 1.7e12 wypada gdzieś w roku ~55000 —
**standardowa kontrola wygaśnięcia nigdy nie zadziała**. Ratuje to ręczne
sprawdzenie w liniach 63-64, które konsekwentnie operuje na milisekundach.
Działa, ale jest to pułapka: ktokolwiek kiedyś uprości ten warunek albo poda ten
token innemu weryfikatorowi, dostanie token wieczny. Fix: sekundy + `expiresIn`.

### N-5 Nieużywane `PUBLIC_STRIPE_PK` w `.env.example`

**[potwierdzone]** `grep` po `src/` nie znajduje ani `STRIPE_PK`, ani
`loadStripe`, ani `@stripe/stripe-js` — checkout przekierowuje na `session.url`
serwerowo. Zmienna jest martwa, dokładnie tak jak usunięte wcześniej
`ADMIN_PASSWORD`. Poza tym parytet `.env.example` względem kodu jest **pełny** —
sprawdziłem wszystkie importy z `$env/*`.

### N-6 `npm run check` nie generuje klienta Prisma

`package.json:11` — `svelte-kit sync && svelte-check`. Na świeżym klonie (i na
CI) daje to 22 błędy typu „implicitly has an 'any' type" w miejscach, gdzie typ
pochodzi z wygenerowanego klienta. Po `npx prisma generate` jest 0 błędów. Fix:
`"check": "prisma generate && svelte-kit sync && svelte-check ..."`.

### N-7 Catch-all zamiast 404 na całej stronie

`src/routes/[...missing]/+page.server.ts:45` przekierowuje **każdy** nieznany URL
(308) na `/pl/home` albo `/pl/<strona>`. Dla starych URL-i to jest dokładnie to,
o co chodziło. Efekt uboczny: strona nie ma w ogóle prawdziwego 404 — literówka
w adresie, brakujący asset czy skan bota dostają 308 na stronę główną. Dla Google
to sygnał soft-404 i psuje statystyki. Fix: zawęzić catch-all do znanych legacy
ścieżek i prefiksów, reszcie oddać 404.

### N-8 `size` w publicznym listingu bloga bez górnego limitu

`src/remote/dto/blog.ts:111-115` — `@Min(1)` bez `@Max`. `getBlogArticles` jest
publiczne i wstawia `size` prosto w `take`. Przy dzisiejszej liczbie artykułów
nieszkodliwe, ale to darmowy `@Max(100)`. To samo w `PaginationParamsDto`.

### N-9 `CRON_SECRET` porównywany zwykłym `!==`

`src/routes/api/cron/media-sweep/+server.ts:22` — porównanie zwiera się na
pierwszym różnym bajcie. Realna eksploatacja przez sieć jest trudna, ale endpoint
bramkuje kasowanie plików, więc `crypto.timingSafeEqual` jest tu tani. Zachowanie
przy pustym sekrecie jest natomiast **poprawne** (fail-closed przez `!secret`).

### N-10 `/og/<lang>.png` można zmuszać do renderowania w kółko

`src/routes/og/[lang=lang].png/+server.ts:41-54` — cache trzyma 64 wpisy, kluczem
jest `locale|title|subtitle`. Zmieniając `title` przy każdym żądaniu omija się
i ten cache, i CDN, a każde trafienie to pełny render satori + resvg. Bez
rate limitingu to prosta amplifikacja kosztu CPU. Nisko, bo wymaga celowego
działania i nie wycieka danych.

### N-11 Migracja czyta tylko pierwszą partię kursora

`scripts/migrate-prod-data.js:224` — `found?.cursor?.firstBatch` przy
`batchSize: 1000`. Dla dwóch artykułów bez znaczenia, ale gdyby kiedyś puścić to
na większym zbiorze, reszta zostanie **po cichu pominięta** (bez błędu, bez
ostrzeżenia). Warto co najmniej zalogować, gdy `firstBatch.length` zrówna się
z `batchSize`.

### N-12 Migracja nie jest atomowa między utworzeniem tłumaczenia a `$unset`

`scripts/migrate-prod-data.js:301-315` — tłumaczenie powstaje osobnym zapisem niż
czyszczenie starych pól. Awaria pomiędzy zostawia dokument z jednym i drugim,
a ponowny przebieg pominie go (`alreadyMigrated > 0`) i nigdy nie dokończy
`$unset`. Stan jest nieszkodliwy funkcjonalnie (stare pola są ignorowane), ale
uwaga: **te osierocone `mediaIds` to jedyne, co po B-3 chroniłoby zdjęcia** —
patrz fix legacy w B-3.

### N-13 `Accept-Language` bez wag `q`

`src/routes/+page.server.ts:9-16` — nagłówek jest cięty po przecinku i `;`, więc
kolejność wpisów decyduje zamiast `q`. Przeglądarki i tak wysyłają w kolejności
preferencji, więc w praktyce działa. Info.

### N-14 `BlogArticleBySlugDto.slug` bez `@Matches`/`@MaxLength`

`src/remote/dto/blog.ts:124-127` — ścieżka zapisu (admin) ma pełny
`@Matches(SLUG_REGEX)` i `@MaxLength(120)`, publiczna ścieżka odczytu nie ma nic
poza `@MinLength(1)`. Prisma buduje typowane zapytanie równościowe, więc nie ma
tu wstrzyknięcia — czysto defense-in-depth.

### N-15 `robots.txt` wpuszcza roboty na `/admin`, a panel nie ma żadnych meta

**[potwierdzone]** `static/robots.txt` to `Disallow:` (pusta reguła = wpuść
wszędzie). Jednocześnie po wyczyszczeniu `app.html` ze statycznych metatagów
strony panelu **nie renderują komponentu `<Seo>` w ogóle** — sprawdziłem
`(admin)/admin/+layout.svelte` i `+page.svelte`: ani `<title>`, ani `robots`.
Podstrony za loginem i tak przekierują robota, ale `/admin/login` jest publicznie
dostępny i nic nie stoi na przeszkodzie, żeby wpadł do indeksu. Fix: `Disallow: /admin`
w `robots.txt` plus `<Seo noindex />` w layoucie panelu.

### N-16 JSON-LD produktów jest budowany i zapisywany, ale nigdy nierenderowany

**[potwierdzone]** `admin-products.remote.ts:161` woła `buildProductJsonLD` przy
każdym zapisie produktu i trzyma wynik w `metadataJsonLD`. Tymczasem `jsonLd`
przekazuje do `<Seo>` **wyłącznie** strona artykułu
(`[lang=lang]/blog/[slug]/+page.svelte:45`) — `/shop` i `/price-list` wołają
`<Seo>` tylko z `title` i `description`. Czyli dane strukturalne ofert powstają,
zajmują miejsce w bazie i nie trafiają na żadną stronę: Google nie zobaczy ani
cen, ani dostępności. Fix: przekazać `jsonLd` na `/shop` i `/price-list`
(dla listy produktów najlepiej jako `ItemList` albo `@graph`).

### N-17 Sześć komunikatów walidacji pokazuje surowy angielski

**[potwierdzone]** `src/shared/server/validators.ts:41-58` opakowuje w tłumaczenia
14 dekoratorów, ale reszta idzie przez `...cv` bez zmian. W DTO faktycznie
używane, a **nieopakowane** są: `Matches`, `IsInt`, `ArrayNotEmpty`, `IsBoolean`,
`IsNotEmpty`, `ValidateNested`. Ironia polega na tym, że słownik ma już gotowe
tłumaczenia dla `Matches` („Wartość ma nieprawidłowy format") i `IsInt` („Musi być
liczbą całkowitą") — są martwe. W praktyce: admin wpisuje slug z wielką literą
i dostaje `slug must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/ regular expression`
zamiast polskiego komunikatu, który leży obok nieużywany. Fix: dopisać brakujące
dekoratory do listy w `validators.ts`.

### N-18 `og:image:width/height` zawsze 1200×630, także dla własnych obrazków

`src/lib/Seo/Seo.svelte:68-69` podaje wymiary na sztywno. Dla generowanego
og-image to prawda, ale artykuł z własnym `featuredImageUrl` przekazuje `image`
o dowolnych proporcjach — a my i tak deklarujemy 1200×630. Facebook i LinkedIn
potrafią na tej podstawie przyciąć podgląd. Fix: podawać wymiary tylko wtedy, gdy
obrazek pochodzi z `/og/`.

### N-19 `prisma.config.ts` czyta tylko `.env.local`, a repo dokumentuje `.env`

**[potwierdzone eksperymentalnie]** `prisma.config.ts:7-13` ładuje ręcznie
`.env.local`. Sęk w tym, że sama obecność `prisma.config.ts` **wyłącza**
automatyczne wczytywanie `.env` przez Prisma CLI — czyli plik, który tworzy każdy,
kto pójdzie za `.env.example`, przestaje działać dla `prisma generate` / `db push`.

Sprawdziłem: z `.env` zawierającym `DATABASE_URL` i pustym środowiskiem
`npx prisma validate` kończy się `Validation Error Count: 1 [Context: getConfig]`.
Ponieważ `npm run dev` to `prisma generate && prisma db push && vite dev`, nowa
osoba w projekcie odbije się na pierwszym poleceniu — mimo że zrobiła wszystko
zgodnie z `.env.example`. Warstwa aplikacji tego nie zdradzi, bo Vite czyta `.env`
normalnie. Fix: dopisać `.env` do listy ładowanych plików w `prisma.config.ts`
albo zmienić `.env.example` na `.env.local` i odnotować to w README.

### N-20 Lint CI nie uruchamia się na żadnym PR

`.github/workflows/lint-check.yml:3-7` reaguje na pull requesty do `main` i
`develop`. Domyślną gałęzią repozytorium jest **`master`**, a gałęzi `main` ani
`develop` w ogóle nie ma (`master`, `feat/improvements`,
`claude/todo-technical-improvements`). Workflow nie odpalił się więc ani razu — co
tłumaczy, jak zmiana tej wielkości przeszła bez zielonego CI. Plik jest sprzed
tego brancha, więc to stan zastany, ale wart naprawy przy okazji: wystarczy
zamienić `main`/`develop` na `master`.

### N-21 Lokalna baza w `docker-compose.yml` bez uwierzytelniania

`docker-compose.yml` uruchamia MongoDB bez włączonej autoryzacji i z portem
wystawionym na wszystkie interfejsy. Dla `localhost` to wygodne, ale na
współdzielonej sieci (kawiarnia, coworking, publiczne Wi-Fi) baza deweloperska
stoi otworem. Fix: zbindować na `127.0.0.1:27017:27017`.

### N-22 Martwy kod i zależności po migracji na remote functions

Zostały pliki, których już nikt nie importuje: `build-response.ts` i
`validate-body.ts` (zastąpione przez `dto-schema.ts` + `remote-error.ts`).
W `dependencies` siedzą też `@types/bcrypt` (bez samego `bcrypt` — patrz N-3) i
`googleapis`, którego kod nie używa; `googleapis` to kilkadziesiąt megabajtów
w bundlu produkcyjnym. Fix: usunąć jedno i drugie.

### N-23 `adapter-auto` dostaje opcje, których nie przyjmuje

`svelte.config.js:21` przekazuje do `adapter-auto` `edge: false` / `split: true`.
`adapter-auto` nie przyjmuje opcji — deleguje do wykrytego adaptera i te wartości
są po cichu ignorowane. Jeśli zależy Wam na kontroli nad funkcjami Vercela,
trzeba wejść w jawny `@sveltejs/adapter-vercel`.

---

## Zgłoszenia, które odpadły w weryfikacji

Uczciwość wymaga pokazania też tego, co nie przetrwało sprawdzenia — bo obie
odrzucone tezy brzmiały poważnie, a jedną z nich sam wpisałem początkowo jako
bloker krytyczny.

**„Formularz zapisu jest martwy" — nieprawda.** Recenzja zgłosiła rozjazd
`therapyType` / `therapyProductId` jako całkowitą blokadę zapisów i tak też to
najpierw opisałem, opierając się na teście samej schemy yup w oderwaniu od
formularza. To był błąd metody: sprawdzałem schemę, a nie komponent. Weryfikator
wskazał, że select niesie `name="therapyType"` i `onblur={handleChange}`, a
biblioteka rozwiązuje pole po `name` — więc brakująca wartość dopisuje się przy
opuszczeniu pola. Odtworzyłem pełny cykl życia formularza na prawdziwych
paczkach: `onSubmit` **jest** wywoływane, przycisk pozostaje aktywny. Zostaje
realna, ale znacznie mniejsza usterka — opisana jako S-8.

**„Nieistniejący artykuł zwraca 200" — nieprawda.** Rozumowałem, że skoro
`<svelte:boundary>` łapie błąd po wysłaniu powłoki strony, status musi zostać 200. Weryfikator postawił serwer deweloperski i odtworzył realne żądanie:
odpowiedź to **404**. Zapytanie jest wołane podczas SSR, jego odrzucenie
propaguje się do odpowiedzi i SvelteKit ustawia właściwy status. Punkt wycofany
w całości — bez zastrzeżeń.

Nie sprawdzałem tego drugiego samodzielnie: uruchomienie `npm run dev` woła
`prisma db push`, a `DATABASE_URL` w tym środowisku wskazuje bazę, której
zawartości nie znam. Modyfikowanie jej po to, żeby potwierdzić drobiazg, byłoby
nieproporcjonalne do zysku.

## Potwierdzam ustalenia poprzedniego audytu

Wszystkie pięć uwag kodowych z `AUDYT.md` prześledziłem niezależnie i **wszystkie
się bronią**:

1. Komunikat błędu captchy nie dociera do użytkownika — potwierdzone,
   `ContactForm.svelte:118-129`: gałąź bez `issues` pokazuje generyczny
   `toast.error`, a klucz z serwera przepada.
2. `<i>Brak wiadomości</i>` niezlokalizowane — potwierdzone,
   `webhook/+server.ts:48` i `contact.remote.ts`.
3. Brak escapowania HTML w mailach — potwierdzone, rozwinięte w S-5.
4. `translateWith` interpoluje stringiem — potwierdzone, `i18n.ts:67`.
5. `sendRegistrationRequest` to martwy kod — potwierdzone, `contact.remote.ts:36`.
   Dodam, że jest to `command`, czyli **publicznie wywoływalny endpoint**, a nie
   tylko nieużywana funkcja — warto usunąć, nie tylko odnotować.

## Sprawdzone i w porządku — nie trzeba wracać

- **Autoryzacja panelu jest szczelna.** Przejrzałem wszystkie cztery pliki
  `src/remote/admin-*.remote.ts`: każda z 11 operacji (query i command) zaczyna się
  od `requireAdmin()`. Ani jednej luki.
- **Captcha faktycznie fail-closed** — `verify-captcha.ts` zwraca `false` przy
  braku sekretu, braku tokenu i przy wyjątku z `fetch`. Zgodnie z opisem.
- **Slugi nie złamią XML-a sitemapy** — `SLUG_REGEX` to `^[a-z0-9]+(?:-[a-z0-9]+)*$`
  i jest wymuszony przez `@Matches` na ścieżce zapisu. Teza z `AUDYT.md` się broni.
- **Fallback og:image nie jest cache'owany** — przekierowanie leci przez `redirect()`,
  nagłówki `immutable` są tylko w `pngResponse`. Zgodnie z opisem.
- **hreflang na artykułach jest poprawny** — strona przekazuje `alternates`
  z prawdziwymi slugami per język; `x-default` wskazuje polski.
- **Transliteracja ukraińska** (`slugify.ts`) pokrywa pełny alfabet, obcina do 80
  znaków i czyści myślniki na końcu. Migracja dodatkowo rozwiązuje kolizje
  sufiksem numerycznym.
- **Parytet `.env.example`** względem faktycznie czytanych zmiennych — pełny,
  z jednym nadmiarowym wpisem (N-5).
- **Idempotencja migracji** — artykuły po `blogArticleId`, produkty po `slug`.
  Ponowny przebieg nic nie duplikuje.

## Zastrzeżenia do `AUDYT.md`

Trzy rzeczy do skorygowania w checkliście, żeby nie wprowadzała w błąd:

1. **„flaga `CONTACT_FORM_CAPTCHA_ENABLED` na `true`"** jest wymieniona obok
   zmiennych środowiskowych, co sugeruje, że to konfiguracja. To stała w kodzie
   (`src/shared/global/config/feature-flags.ts:11`) — włączenie captchy wymaga
   commita i redeployu, nie kliknięcia w panelu Vercela.
2. **Kolejność kroków jest niebezpieczna.** Checklista stawia „Deploy" przed
   „Migracja danych", nie ostrzegając, że pomiędzy nimi może wejść cron i skasować
   zdjęcia (B-3). Migracja musi być pierwszą rzeczą po deployu.
3. **„Zweryfikować produkty w `/admin/shop` … ewentualnie dodać opisy"** — w
   obecnym stanie zapis odbije się walidacją, a konsultacji nie da się zapisać
   wcale (S-6).
4. **Brakuje `AWS_S3_ENDPOINT` na liście zmiennych do ustawienia** — a bez niej
   deploy nie przejdzie etapu builda (B-1). To jedyna nowa zmienna wymagana przez
   ten branch, o której checklista milczy.
5. **„Stare URL-e … 301-ują na `/pl/...`"** — kod emituje **308**
   (`HttpStatus.PERMANENT_REDIRECT = 308`, `http-status.ts:22`). Funkcjonalnie
   różnica jest bez znaczenia (oba są trwałe, 308 dodatkowo zachowuje metodę),
   ale `TODO.md` podaje 308 poprawnie, więc rozjazd jest tylko w `AUDYT.md`.

## Metodologia

Diff `origin/master...HEAD`, 169 plików, +9255/−5780.

Wszystkie siedem recenzji tematycznych i wszystkie siedem przebiegów weryfikacji
dobiegło do końca — 14 agentów, zero błędów, 79 zgłoszeń. Każde trafiło następnie
do osobnego weryfikatora nastawionego na **obalenie** tezy. Wynik: **77 CONFIRMED,
2 REFUTED**. Obie odrzucone tezy opisałem wyżej, razem z tym, którą z nich sam
początkowo zakwalifikowałem błędnie jako bloker — weryfikacja adversarialna
zarobiła tu na siebie.

Dlatego **żadne znalezisko nie trafiło tu na podstawie samego raportu agenta**.
Każdą pozycję prześledziłem osobiście w pełnych plikach źródłowych — a tam, gdzie
sama lektura nie wystarczała, sprawdziłem empirycznie:

- **B-1** odtworzony uruchomieniem builda z odpiętą zmienną; komunikat rollupa
  wklejony w treści.
- **B-2** potwierdzony odczytem unii typów zainstalowanego SDK Stripe
  (`grep` po `'uk'` w `SessionsResource.d.ts` daje zero trafień).
- **S-8** odtworzony pełnym cyklem życia formularza na zainstalowanych `yup`
  i `svelte-forms-lib` — dopiero to pokazało, że pierwotna diagnoza była zbyt
  ostra.
- **N-19** sprawdzony realnym `prisma validate` z `.env` i pustym środowiskiem.
- **N-3** porównany z `origin/master`, żeby odróżnić regresję od stanu zastanego.
- **Autoryzacja panelu** — przejrzane wszystkie jedenaście operacji admina pod
  kątem `requireAdmin()`.
- **Stan build/checks** — `svelte-check`, `lint` i `vite build` uruchomione
  realnie, nie założone.

Zgłoszenia, których nie udało mi się potwierdzić w kodzie, do tego dokumentu nie
weszły.
