<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';
	let { data } = $props();
	let buying = $state(false);
	let checkoutError = $state('');
	async function buyBook() {
		if (buying) return;
		buying = true;
		checkoutError = '';
		try {
			const response = await fetch('/api/books/checkout?book=kiedy-lek-atakuje-pl', {
				method: 'POST'
			});
			const result = await response.json();
			if (!response.ok || !result.url) throw new Error();
			window.location.assign(result.url);
		} catch {
			checkoutError =
				'Nie udało się otworzyć płatności. Spróbuj później lub napisz na bezstresowo.org@gmail.com.';
			buying = false;
		}
	}
	const parts = [
		{
			n: '01',
			title: 'Rozpoznawać swoje reakcje i szukać oparcia',
			text: 'Przyjrzysz się temu, jak odczuwasz lęk. Wypróbujesz ćwiczenia skupiania uwagi, zauważania sygnałów ciała i odpoczynku.'
		},
		{
			n: '02',
			title: 'Myśli, wymagania wobec siebie i własne granice',
			text: 'Zajmiesz się niepokojącymi przewidywaniami, pośpiechem, presją, by robić wszystko bezbłędnie, i pomijaniem własnych potrzeb.'
		},
		{
			n: '03',
			title: 'Dbać o siebie na co dzień',
			text: 'Wybierzesz sposoby, które Ci pomagają, sprawdzisz, na co masz wpływ, i przygotujesz własny plan na trudniejsze chwile.'
		}
	];
</script>

<Seo
	title="Kiedy lęk atakuje: książka z 21 ćwiczeniami | Bezstresowo"
	description="Książka Olesyi Haiduk o lęku, napięciu i dbaniu o siebie. 21 szczegółowych ćwiczeń we własnym tempie. PDF, 75 stron, 49 zł."
	noindex
/>
<div class="bg-background text-primary">
	<section class="px-5 py-16 sm:px-8 lg:py-24">
		<div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
			<div class="mx-auto w-full max-w-sm">
				<img
					src="/assets/kiedy-lek-atakuje-cover-pl.webp"
					alt="Okładka książki Kiedy lęk atakuje"
					class="aspect-[.707] w-full rounded-xl object-cover shadow-2xl shadow-primary/20"
					width="893"
					height="1263"
				/>
			</div>
			<div>
				<p class="text-sm font-bold tracking-widest text-accent uppercase">
					Książka z ćwiczeniami · PDF
				</p>
				<h1 class="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Kiedy lęk atakuje</h1>
				<p class="mt-4 text-xl font-semibold">
					21 ćwiczeń, by lepiej zrozumieć swój lęk i zadbać o siebie
				</p>
				<p class="mt-6 leading-relaxed text-slate-600">
					Jedna niepokojąca myśl potrafi pociągnąć za sobą kilkanaście kolejnych. Próbujesz wszystko
					przewidzieć, wracasz do tych samych pytań i czujesz zmęczenie, choć nic złego jeszcze się
					nie wydarzyło.
				</p>
				<p class="mt-4 leading-relaxed text-slate-600">
					W książce znajdziesz wyjaśnienia, przykłady, ćwiczenia opisane krok po kroku i miejsce na
					własne notatki. Przyjrzysz się swoim reakcjom i sprawdzisz, co pomaga Ci w chwilach lęku.
				</p>
				<div class="mt-8 flex flex-wrap items-center gap-5">
					<strong class="text-3xl">49 zł</strong><span class="text-base text-slate-500"
						>75 stron · książka elektroniczna PDF</span
					>
				</div>
				<button
					type="button"
					disabled={!data.bookSalesReady || buying}
					onclick={buyBook}
					class="mt-6 min-h-12 rounded-xl bg-accent px-8 py-3 font-bold text-primary disabled:cursor-not-allowed disabled:opacity-65"
					>{buying ? 'Otwieram płatność…' : 'Kup książkę za 49 zł'}</button
				>
				<p class="mt-3 text-sm text-slate-600">
					{data.bookSalesReady
						? 'Po potwierdzeniu płatności otrzymasz email z linkiem do pobrania PDF.'
						: 'Sprzedaż jest jeszcze przygotowywana. Wkrótce kupisz książkę na tej stronie.'}
				</p>
				{#if checkoutError}<p role="alert" class="mt-3 text-base text-red-700">
						{checkoutError}
					</p>{/if}
			</div>
		</div>
	</section>
	<section class="bg-white px-5 py-16 sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
			<h2 class="font-serif text-3xl">Dla kogo jest ta książka?</h2>
			<div class="space-y-4 leading-relaxed text-slate-600">
				<p>
					Dla kobiet, które często wyobrażają sobie czarne scenariusze, czują napięcie, próbują
					wszystko kontrolować lub mają trudność z odpoczynkiem.
				</p>
				<p>
					Nie musisz mieć diagnozy ani wykonywać wszystkich ćwiczeń po kolei. Możesz wybrać temat,
					który jest Ci teraz bliski, zrobić przerwę i wrócić później.
				</p>
				<h3 class="pt-4 text-xl font-semibold text-primary">Dla psychologów i psychoterapeutów</h3>
				<p>
					Książka może być dodatkowym materiałem psychoedukacyjnym w pracy z klientkami. To
					specjalista ocenia, czy wybrane ćwiczenie pasuje do sytuacji danej osoby. Nie jest to
					gotowy protokół leczenia zaburzeń lękowych.
				</p>
			</div>
		</div>
	</section>
	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<h2 class="font-serif text-3xl">Co znajdziesz w środku?</h2>
			<div class="mt-8 grid gap-6 md:grid-cols-3">
				{#each parts as part}<article class="rounded-2xl border border-primary/15 bg-white p-7">
						<p class="font-bold text-accent">{part.n}</p>
						<h3 class="mt-3 font-serif text-2xl">{part.title}</h3>
						<p class="mt-4 leading-relaxed text-slate-600">{part.text}</p>
					</article>{/each}
			</div>
			<p class="mt-8 leading-relaxed">
				Każde z 21 ćwiczeń zawiera wyjaśnienie, instrukcję i miejsce na notatki. Na końcu znajdziesz
				krótki plan wsparcia do uzupełnienia.
			</p>
		</div>
	</section>
	<section class="bg-white px-5 py-16 sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
			<h2 class="font-serif text-3xl">We własnym tempie</h2>
			<div class="space-y-4 leading-relaxed text-slate-600">
				<p>
					„21 ćwiczeń” opisuje strukturę książki. Nie oznacza, że masz ukończyć ją w 21 dni. Na
					jeden temat możesz przeznaczyć około 15–25 minut lub podzielić pracę na krótsze sesje.
				</p>
				<p>
					PDF nie zawiera interaktywnych pól. Możesz drukować strony, zapisywać odpowiedzi w
					zeszycie lub użyć aplikacji do nanoszenia notatek na PDF.
				</p>
				<p>
					Jeśli ćwiczenie zwiększa napięcie, możesz je skrócić, zmienić lub pominąć. W książce
					opisano również sytuacje, w których warto poszukać pomocy specjalisty.
				</p>
			</div>
		</div>
	</section>
	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-3xl">
			<h2 class="font-serif text-3xl">O autorce</h2>
			<p class="mt-5 font-semibold">Olesya Haiduk · Psychoterapeutka · Bezstresowo</p>
			<p class="mt-4 leading-relaxed text-slate-600">
				Pracuję z lękiem, obniżonym nastrojem, zaburzeniami odżywiania, samooceną i trudnościami w
				relacjach. Prowadzę konsultacje indywidualne i pracuję z parami. Tę książkę przygotowałam
				dla kobiet, które chcą lepiej rozumieć własne reakcje i wiedzieć, jak mogą o siebie zadbać.
			</p>
			<h2 class="mt-12 font-serif text-3xl">Częste pytania</h2>
			{#each [{ q: 'Jak otrzymam książkę?', a: 'Po potwierdzeniu płatności otrzymasz email z przyciskiem pobrania. Link nie ma terminu ważności i pozwala na trzy pobrania. Zapisany PDF możesz czytać bez ograniczenia czasu.' }, { q: 'Czy książka zastępuje psychoterapię?', a: 'Nie. Ma charakter psychoedukacyjny. Może uzupełniać spotkania ze specjalistą, ale ich nie zastępuje.' }, { q: 'Czy muszę wykonać wszystkie ćwiczenia?', a: 'Nie. Możesz wybierać tematy, wracać do nich i robić przerwy. Książka nie wymaga codziennej pracy.' }, { q: 'Czy mogę użyć promokodu?', a: 'Tak. Jeśli masz ważny kod, wpisz go na stronie płatności. Przed zapłaceniem sprawdź końcową kwotę.' }] as item}<details
					class="mt-4 rounded-xl border border-primary/15 bg-white p-5"
				>
					<summary class="cursor-pointer text-lg font-semibold">{item.q}</summary>
					<p class="mt-3 leading-relaxed text-slate-600">{item.a}</p>
				</details>{/each}
			<h2 class="mt-12 font-serif text-3xl">Potrzebujesz indywidualnego wsparcia?</h2>
			<p class="mt-4 leading-relaxed">
				Możesz umówić konsultację, niezależnie od tego, czy kupisz książkę.
			</p>
			<a
				href="/pl/registrations"
				class="mt-5 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
				>Umów konsultację</a
			>
			<p class="mt-10 text-sm leading-relaxed text-slate-600">
				Książka ma charakter psychoedukacyjny. Nie służy do stawiania diagnozy i nie zastępuje
				psychoterapii ani opieki medycznej. Nowe lub silne objawy fizyczne wymagają oceny
				lekarskiej. W sytuacji bezpośredniego zagrożenia życia lub zdrowia skontaktuj się z
				lokalnymi służbami ratunkowymi.
			</p>
		</div>
	</section>
</div>
