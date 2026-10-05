<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';
	import { getLocale, Locale } from '$i18n';
	const isUkrainian = $derived(getLocale() === Locale.ukUA);
	let { data } = $props();
	let buying = $state(false);
	let checkoutError = $state('');
	let promoCode = $state('');
	async function buyBook() {
		if (buying) return;
		buying = true;
		checkoutError = '';
		try {
			const response = await fetch(
				isUkrainian ? '/api/books/checkout' : '/api/books/checkout?book=kiedy-lek-atakuje-pl',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ promoCode: promoCode.trim() })
				}
			);
			const result = await response.json();
			if (response.status === 400 && result.message) {
				checkoutError = result.message;
				buying = false;
				return;
			}
			if (!response.ok || !result.url) throw new Error('Checkout unavailable');
			window.location.assign(result.url);
		} catch {
			checkoutError = isUkrainian
				? 'Не вдалося відкрити оплату. Спробуй пізніше або напиши на bezstresowo.org@gmail.com.'
				: 'Nie udało się otworzyć płatności. Spróbuj później lub napisz na bezstresowo.org@gmail.com.';
			buying = false;
		}
	}

	const topics = $derived([
		{
			number: '01',
			title: isUkrainian
				? 'Помічати свій стан і знаходити опору'
				: 'Rozpoznawać swoje reakcje i szukać oparcia',
			text: isUkrainian
				? 'Як саме проявляється твоя тривога? Що допомагає трохи повернути увагу до себе й того, що є навколо?'
				: 'Jak odczuwasz lęk? Co pomaga Ci skierować uwagę na siebie i to, co dzieje się wokół?'
		},
		{
			number: '02',
			title: isUkrainian
				? 'Думки, вимоги до себе й особисті межі'
				: 'Myśli, wymagania wobec siebie i własne granice',
			text: isUkrainian
				? 'Тривожні припущення, поспіх, прагнення зробити все бездоганно та місце для власних потреб.'
				: 'Niepokojące przewidywania, pośpiech, presja, by robić wszystko bezbłędnie, i miejsce na własne potrzeby.'
		},
		{
			number: '03',
			title: isUkrainian ? 'Підтримка в повсякденному житті' : 'Dbać o siebie na co dzień',
			text: isUkrainian
				? 'Доступні способи підтримки, межі твого впливу й короткий план, до якого можна повертатися.'
				: 'Sposoby, które Ci pomagają, to, na co masz wpływ, i krótki plan wsparcia, do którego możesz wracać.'
		}
	]);
</script>

<Seo
	alternates={[
		{ locale: Locale.ukUA, path: '/materials/koly-tryvoha-atakuie' },
		{ locale: Locale.plPL, path: '/materials/kiedy-lek-atakuje' }
	]}
	title={isUkrainian
		? 'Коли тривога атакує: книга-практикум, 21 практика | Bezstresowo'
		: 'Kiedy lęk atakuje: książka z 21 ćwiczeniami | Bezstresowo'}
	description={isUkrainian
		? 'Електронна книга Олесі Гайдук про тривожні думки, напругу й підтримку себе. 21 докладна практика у власному темпі. PDF, 75 сторінок, 49 zł.'
		: 'Książka Olesyi Haiduk o lęku, napięciu i dbaniu o siebie. 21 szczegółowych ćwiczeń we własnym tempie. PDF, 75 stron, 49 zł.'}
	noindex
/>

<div class="bg-background text-primary">
	<section class="px-5 py-16 sm:px-8 lg:py-24">
		<div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
			<div class="mx-auto w-full max-w-sm">
				<img
					src={isUkrainian
						? '/assets/koly-tryvoha-atakuie-cover-ua.webp'
						: '/assets/kiedy-lek-atakuje-cover-pl.webp'}
					alt={isUkrainian
						? 'Обкладинка книги «Коли тривога атакує»'
						: 'Okładka książki Kiedy lęk atakuje'}
					class="aspect-[.707] w-full rounded-xl object-cover shadow-2xl shadow-primary/20"
					width="893"
					height="1263"
				/>
			</div>
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
					{isUkrainian ? 'Книга-практикум · PDF' : 'Książka z ćwiczeniami · PDF'}
				</p>
				<h1 class="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
					{isUkrainian ? 'Коли тривога атакує' : 'Kiedy lęk atakuje'}
				</h1>
				<p class="mt-4 text-xl font-semibold">
					{isUkrainian
						? '21 практика, щоб зрозуміти свій стан і знайти опору'
						: '21 ćwiczeń, by lepiej zrozumieć swój lęk i zadbać o siebie'}
				</p>
				<p class="mt-6 max-w-xl leading-relaxed text-slate-600">
					{isUkrainian
						? 'Буває, що одна тривожна думка тягне за собою десяток інших. Ти намагаєшся все передбачити й втомлюєшся навіть тоді, коли нічого поганого ще не сталося.'
						: 'Jedna niepokojąca myśl potrafi pociągnąć za sobą kilkanaście kolejnych. Próbujesz wszystko przewidzieć i czujesz zmęczenie, choć nic złego jeszcze się nie wydarzyło.'}
				</p>
				<p class="mt-4 max-w-xl leading-relaxed text-slate-600">
					{isUkrainian
						? 'У книзі є пояснення, приклади, докладні кроки й місце для власних записів. Вона допоможе придивитися до свого стану та спробувати способи підтримки у власному темпі.'
						: 'W książce znajdziesz wyjaśnienia, przykłady, ćwiczenia opisane krok po kroku i miejsce na własne notatki. Przyjrzysz się swoim reakcjom i sprawdzisz we własnym tempie, co pomaga Ci w chwilach lęku.'}
				</p>
				<div class="mt-8 flex flex-wrap items-center gap-5">
					<strong class="text-3xl">49 zł</strong>
					<span class="text-sm text-slate-500"
						>{isUkrainian
							? '75 сторінок · електронна книга у PDF'
							: '75 stron · książka elektroniczna PDF'}</span
					>
				</div>
				{#if data.bookSalesReady}
					<details class="mt-5 max-w-sm text-sm">
						<summary class="cursor-pointer font-semibold underline underline-offset-4">
							{isUkrainian ? 'Маєш промокод?' : 'Masz kod promocyjny?'}
						</summary>
						<label for="book-promo-code" class="mt-3 block font-semibold">
							{isUkrainian ? 'Промокод' : 'Kod promocyjny'}
						</label>
						<input
							id="book-promo-code"
							bind:value={promoCode}
							maxlength="64"
							autocomplete="off"
							disabled={buying}
							class="mt-2 w-full rounded-lg border border-primary/25 bg-white px-4 py-3 text-base"
						/>
						<p class="mt-2 text-slate-500">
							{isUkrainian
								? 'Знижка з’явиться на сторінці оплати. Перевір кінцеву суму перед платежем.'
								: 'Rabat pojawi się na stronie płatności. Sprawdź końcową kwotę przed zapłaceniem.'}
						</p>
					</details>
				{/if}
				<button
					type="button"
					disabled={!data.bookSalesReady || buying}
					onclick={buyBook}
					class="mt-6 min-h-12 rounded-xl bg-accent px-8 py-3 font-bold text-primary disabled:cursor-not-allowed disabled:opacity-65"
					>{buying
						? isUkrainian
							? 'Відкриваю оплату…'
							: 'Otwieram płatność…'
						: isUkrainian
							? promoCode.trim()
								? 'Перейти до оплати з промокодом'
								: 'Купити книгу за 49 zł'
							: promoCode.trim()
								? 'Przejdź do płatności z kodem'
								: 'Kup książkę za 49 zł'}</button
				>
				<p class="mt-3 text-sm text-slate-500">
					{data.bookSalesReady
						? isUkrainian
							? 'Після підтвердження оплати на твій email надійде посилання на завантаження PDF.'
							: 'Po potwierdzeniu płatności otrzymasz email z linkiem do pobrania PDF.'
						: isUkrainian
							? 'Продаж книги готується. Незабаром тут можна буде оплатити й отримати PDF на email.'
							: 'Sprzedaż jest jeszcze przygotowywana. Wkrótce kupisz książkę na tej stronie.'}
				</p>
				{#if checkoutError}<p role="alert" class="mt-3 text-sm text-red-700">
						{checkoutError}
					</p>{/if}
			</div>
		</div>
	</section>

	<section class="bg-white px-5 py-16 sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
					{isUkrainian ? 'Для кого' : 'Dla kogo'}
				</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">
					{isUkrainian ? 'Знайомий стан?' : 'Brzmi znajomo?'}
				</h2>
			</div>
			<div class="space-y-4 leading-relaxed text-slate-600">
				<p>
					{isUkrainian
						? 'Для жінок, які часто помічають тривожні прогнози, напругу, бажання все контролювати або складність із відпочинком. Для тих, хто хоче розуміти свій стан і спробувати працювати з ним у власному темпі.'
						: 'Dla kobiet, które często wyobrażają sobie czarne scenariusze, czują napięcie, próbują wszystko kontrolować lub mają trudność z odpoczynkiem. Dla tych, które chcą lepiej rozumieć własne reakcje i przyjrzeć się im we własnym tempie.'}
				</p>
				<p>
					{isUkrainian
						? 'Тобі не потрібно мати діагноз або виконувати всі вправи поспіль. Можна обрати тему, яка зараз відгукується, зробити паузу й продовжити згодом.'
						: 'Nie musisz mieć diagnozy ani wykonywać wszystkich ćwiczeń po kolei. Możesz wybrać temat, który jest Ci teraz bliski, zrobić przerwę i wrócić później.'}
				</p>
			</div>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
				{isUkrainian ? 'Що всередині' : 'Co znajdziesz w środku'}
			</p>
			<h2 class="mt-3 font-serif text-3xl sm:text-4xl">
				{isUkrainian ? 'Три частини, 21 практика' : 'Trzy części, 21 ćwiczeń'}
			</h2>
			<div class="mt-9 grid gap-6 md:grid-cols-3">
				{#each topics as topic (topic)}
					<article class="rounded-3xl border border-primary/15 bg-white p-7 shadow-sm">
						<span class="font-serif text-4xl text-accent">{topic.number}</span>
						<h3 class="mt-5 text-xl leading-snug font-semibold">{topic.title}</h3>
						<p class="mt-4 leading-relaxed text-slate-600">{topic.text}</p>
					</article>
				{/each}
			</div>
			<p class="mt-8 max-w-3xl leading-relaxed text-slate-600">
				{isUkrainian
					? 'Кожна практика має пояснення, кроки виконання та сторінку для записів. Наприкінці є короткий план підтримки, який можна заповнити для себе.'
					: 'Każde ćwiczenie zawiera wyjaśnienie, instrukcję i miejsce na notatki. Na końcu znajdziesz krótki plan wsparcia do uzupełnienia.'}
			</p>
		</div>
	</section>

	<section class="bg-primary px-5 py-16 text-white sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">
					{isUkrainian ? 'Для фахівців' : 'Dla specjalistów'}
				</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">
					{isUkrainian ? 'Матеріал для роботи з клієнтками' : 'Materiał do pracy z klientkami'}
				</h2>
			</div>
			<p class="leading-relaxed text-white/85">
				{isUkrainian
					? 'Психологи й психотерапевти можуть використовувати книгу як додатковий психоосвітній матеріал: обирати окремі практики для обговорення та пропонувати сторінки для записів між зустрічами. Фахівець сам вирішує, чи підходить конкретна вправа людині та її ситуації. Книга не є готовим протоколом лікування тривожних розладів.'
					: 'Psychologowie i psychoterapeuci mogą wykorzystywać książkę jako dodatkowy materiał psychoedukacyjny: wybierać ćwiczenia do omówienia i proponować pracę z nimi między spotkaniami. Specjalista ocenia, czy dane ćwiczenie pasuje do sytuacji konkretnej osoby. Książka nie jest gotowym protokołem leczenia zaburzeń lękowych.'}
			</p>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
					{isUkrainian ? 'Як працювати' : 'Jak pracować z książką'}
				</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">
					{isUkrainian ? 'У своєму темпі' : 'We własnym tempie'}
				</h2>
			</div>
			<div class="space-y-4 leading-relaxed text-slate-600">
				<p>
					{isUkrainian
						? '«21 практика» описує структуру книги, а не термін, за який ти маєш змінитися. Для однієї теми можна виділити приблизно 15–25 хвилин або розділити її на кілька підходів.'
						: '„21 ćwiczeń” opisuje strukturę książki. Nie oznacza, że masz ukończyć ją w 21 dni. Na jeden temat możesz przeznaczyć około 15–25 minut lub podzielić pracę na krótsze sesje.'}
				</p>
				<p>
					{isUkrainian
						? 'Сторінки для записів можна заповнювати після друку. Якщо читаєш із телефону чи планшета, підійдуть нотатки або окремий зошит. PDF не має полів для введення тексту.'
						: 'Strony możesz uzupełniać po wydrukowaniu. Jeśli czytasz na telefonie lub tablecie, możesz zapisywać odpowiedzi w notatkach albo w zeszycie. PDF nie zawiera interaktywnych pól.'}
				</p>
				<p>
					{isUkrainian
						? 'Якщо якась вправа посилює напругу, її можна скоротити, змінити або пропустити. У книзі описано межі самодопомоги та ситуації, коли варто звернутися по професійну допомогу.'
						: 'Jeśli ćwiczenie zwiększa napięcie, możesz je skrócić, zmienić lub pominąć. W książce opisano również ograniczenia samodzielnej pracy i sytuacje, w których warto poszukać pomocy specjalisty.'}
				</p>
			</div>
		</div>
	</section>

	<section class="bg-white px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<h2 class="font-serif text-3xl">{isUkrainian ? 'Поширені запитання' : 'Częste pytania'}</h2>
			<div class="mt-8 grid gap-6 md:grid-cols-2">
				<div>
					<h3 class="font-semibold">
						{isUkrainian
							? 'Чи потрібно пройти книгу за 21 день?'
							: 'Czy muszę ukończyć książkę w 21 dni?'}
					</h3>
					<p class="mt-2 text-slate-600">
						{isUkrainian
							? 'Ні. Можна рухатися у своєму темпі, повторювати окремі практики й робити перерви.'
							: 'Nie. Możesz pracować we własnym tempie, wracać do wybranych ćwiczeń i robić przerwy.'}
					</p>
				</div>
				<div>
					<h3 class="font-semibold">
						{isUkrainian
							? 'Чи підійде книга, якщо я вже проходжу психотерапію?'
							: 'Czy książka może uzupełniać psychoterapię?'}
					</h3>
					<p class="mt-2 text-slate-600">
						{isUkrainian
							? 'Можеш обговорити зі своїм фахівцем, які вправи будуть доречними для твоєї роботи.'
							: 'Możesz porozmawiać ze swoim terapeutą lub terapeutką o tym, które ćwiczenia będą odpowiednie dla Ciebie.'}
					</p>
				</div>
				<div>
					<h3 class="font-semibold">
						{isUkrainian
							? 'Чи можна заповнювати PDF на телефоні?'
							: 'Czy mogę uzupełniać PDF na telefonie?'}
					</h3>
					<p class="mt-2 text-slate-600">
						{isUkrainian
							? 'У файлі немає інтерактивних полів. Записи можна робити в нотатках або в застосунку для позначок на PDF.'
							: 'Plik nie zawiera interaktywnych pól. Możesz używać notatek lub aplikacji do nanoszenia adnotacji na PDF.'}
					</p>
				</div>
				<div>
					<h3 class="font-semibold">
						{isUkrainian
							? 'Чи допоможе книга позбутися тривоги?'
							: 'Czy książka pomoże mi pozbyć się lęku?'}
					</h3>
					<p class="mt-2 text-slate-600">
						{isUkrainian
							? 'Книга не обіцяє зникнення тривоги. Вона допомагає краще помічати свій стан і пробувати способи підтримки.'
							: 'Książka nie obiecuje, że lęk zniknie. Pomaga lepiej rozumieć swoje reakcje i wypróbować sposoby dbania o siebie.'}
					</p>
				</div>
				<div>
					<h3 class="font-semibold">
						{isUkrainian ? 'Як я отримаю книгу?' : 'Jak otrzymam książkę?'}
					</h3>
					<p class="mt-2 text-slate-600">
						{isUkrainian
							? 'Після підтвердження оплати на email надійде посилання без терміну дії. Воно дозволяє три завантаження. Збережений PDF можна читати без обмеження часу.'
							: 'Po potwierdzeniu płatności otrzymasz email z linkiem bez terminu ważności. Pozwala on na trzy pobrania. Zapisany PDF możesz czytać bez ograniczenia czasu.'}
					</p>
				</div>
				<div>
					<h3 class="font-semibold">
						{isUkrainian ? 'Чи можна використати промокод?' : 'Czy mogę użyć promokodu?'}
					</h3>
					<p class="mt-2 text-slate-600">
						{isUkrainian
							? 'Так. Відкрий поле «Маєш промокод?» біля кнопки покупки й введи код. Знижка з’явиться на сторінці оплати. Перевір кінцеву суму перед платежем.'
							: 'Tak. Otwórz pole „Masz kod promocyjny?” przy przycisku zakupu i wpisz kod. Rabat pojawi się na stronie płatności. Sprawdź końcową kwotę przed zapłaceniem.'}
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-white p-8 sm:p-12">
			<h2 class="font-serif text-3xl">{isUkrainian ? 'Про автора' : 'O autorce'}</h2>
			<p class="mt-4 max-w-3xl leading-relaxed text-slate-600">
				<strong class="text-primary">{isUkrainian ? 'Олеся Гайдук' : 'Olesya Haiduk'}</strong
				>{isUkrainian
					? '· психолог і психотерапевт. Працюю з тривогою, депресивними станами, розладами харчової поведінки, самооцінкою та труднощами у стосунках. Проводжу індивідуальні консультації й працюю з парами.'
					: '· psychoterapeutka. Pracuję z lękiem, obniżonym nastrojem, zaburzeniami odżywiania, samooceną i trudnościami w relacjach. Prowadzę konsultacje indywidualne i pracuję z parami.'}
			</p>
			<p class="mt-4 max-w-3xl leading-relaxed text-slate-600">
				{isUkrainian
					? 'Якщо хочеш розібрати конкретну ситуацію разом зі мною, можеш записатися на індивідуальну консультацію. Купувати або завершувати книгу перед цим не потрібно.'
					: 'Jeśli chcesz przyjrzeć się swojej sytuacji razem ze mną, możesz umówić konsultację indywidualną. Nie musisz wcześniej kupować ani kończyć książki.'}
			</p>
			<a
				href={isUkrainian ? '/uk/registrations' : '/pl/registrations'}
				class="mt-6 inline-block font-bold underline decoration-accent decoration-2 underline-offset-4"
				>{isUkrainian ? 'Записатися на консультацію' : 'Umów konsultację'}</a
			>
			<p class="mt-8 max-w-3xl text-sm leading-relaxed text-slate-500">
				{isUkrainian
					? 'Книга має психоосвітній характер, не встановлює діагнозів і не замінює психотерапії чи медичної допомоги. Нові або сильні фізичні симптоми потребують медичної оцінки. Якщо є безпосередня загроза безпеці, звернися до місцевої екстреної служби.'
					: 'Książka ma charakter psychoedukacyjny. Nie służy do stawiania diagnozy i nie zastępuje psychoterapii ani opieki medycznej. Nowe lub silne objawy fizyczne wymagają oceny lekarskiej. W sytuacji bezpośredniego zagrożenia życia lub zdrowia skontaktuj się z lokalnymi służbami ratunkowymi.'}
			</p>
		</div>
	</section>
</div>
