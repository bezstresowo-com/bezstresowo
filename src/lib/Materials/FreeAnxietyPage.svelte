<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';
	import AnxietySpiral from './AnxietySpiral.svelte';
	import { getLocale, Locale } from '$i18n';
	const isUkrainian = $derived(getLocale() === Locale.ukUA);

	const guide = $derived(
		isUkrainian
			? '/documents/koly-dumky-ne-daiut-spokoiu-ua.pdf'
			: '/downloads/Kiedy-mysli-nie-daja-spokoju.pdf'
	);
	const card = '/documents/moia-korotka-opora-pry-tryvozi-ua.pdf';
	const book = $derived(
		isUkrainian ? '/uk/materials/koly-tryvoha-atakuie' : '/pl/materials/kiedy-lek-atakuje'
	);
</script>

<Seo
	alternates={[
		{ locale: Locale.ukUA, path: '/materials/koly-dumky-ne-daiut-spokoiu' },
		{ locale: Locale.plPL, path: '/materials/kiedy-mysli-nie-daja-spokoju' }
	]}
	title={isUkrainian
		? 'Коли думки не дають спокою: безкоштовна вправа | Bezstresowo'
		: 'Kiedy myśli nie dają spokoju: bezpłatne materiały | Bezstresowo'}
	description={isUkrainian
		? 'Безкоштовний матеріал про тривожні думки та картка для збереження. Поміть свою тривожну спіраль і спробуй одну вправу у власному темпі.'
		: 'Krótki przewodnik o niepokojących myślach i karta wsparcia. Jedno ćwiczenie do wykonania we własnym tempie.'}
	noindex
/>

<div class="bg-background text-primary">
	<section class="relative overflow-hidden bg-primary px-5 py-20 text-white sm:px-8 lg:py-28">
		<div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
			<div class="relative z-10">
				<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">
					{isUkrainian ? 'Безкоштовні матеріали' : 'Bezpłatne materiały'}
				</p>
				<h1 class="mt-5 max-w-3xl text-4xl leading-[1.1] font-semibold sm:text-5xl lg:text-6xl">
					{isUkrainian ? 'Коли думки не дають спокою' : 'Kiedy myśli nie dają spokoju'}
				</h1>
				<p class="mt-7 max-w-2xl text-lg leading-relaxed text-white/85">
					{isUkrainian
						? '«А раптом щось станеться?» «Що, як я помилилася?» Іноді одне запитання тягне за собою наступне, а тривога стає дедалі сильнішою.'
						: '„A co, jeśli coś się stanie?” „A jeśli popełniłam błąd?” Czasem jedno pytanie prowadzi do kolejnego, a niepokój coraz bardziej się nasila.'}
				</p>
				<p class="mt-4 max-w-2xl leading-relaxed text-white/80">
					{isUkrainian
						? 'Я підготувала короткий матеріал, який допоможе помітити, як розгортається тривожна думка, і спробувати одну вправу на власній ситуації.'
						: 'Przygotowałam krótki materiał, który pomoże Ci zauważyć, jak jedna obawa prowadzi do kolejnej. Znajdziesz w nim ćwiczenie, które możesz wykonać na przykładzie własnej sytuacji.'}
				</p>
				<a
					href="#zavantazhyty"
					class="mt-8 inline-flex min-h-12 items-center rounded-xl bg-accent px-7 py-3 font-bold text-primary transition hover:bg-secondary"
					>{isUkrainian ? 'Завантажити безкоштовно' : 'Pobierz bezpłatnie'}<span
						aria-hidden="true"
						class="ml-3">↘</span
					>
				</a>
				<p class="mt-3 text-sm text-white/65">
					{isUkrainian
						? 'Два PDF-файли. Без реєстрації та електронної адреси.'
						: 'Materiały PDF. Bez rejestracji i podawania adresu email.'}
				</p>
			</div>
			<div class="relative mx-auto w-full max-w-sm" aria-hidden="true">
				<div
					class="relative aspect-[.705] overflow-hidden rounded-2xl border border-white/20 bg-primary p-9 shadow-2xl shadow-black/25"
				>
					<p class="text-xs font-bold tracking-widest">BEZSTRESOWO</p>
					<p class="mt-10 font-serif text-4xl leading-tight">
						{isUkrainian ? 'Коли думки' : 'Kiedy myśli'}<br />{isUkrainian
							? 'не дають'
							: 'nie dają'}<br />{isUkrainian ? 'спокою' : 'spokoju'}
					</p>
					<AnxietySpiral class="absolute right-4 bottom-22 h-56 w-72 opacity-70" />
					<p class="absolute bottom-9 left-9 text-sm leading-snug text-white/80">
						{isUkrainian
							? 'Коротка карта тривожної спіралі'
							: 'Jak jedna obawa prowadzi do kolejnej'}<br />{isUkrainian
							? 'та одна практика для себе'
							: 'i jedno ćwiczenie dla Ciebie'}
					</p>
				</div>
			</div>
		</div>
	</section>

	<section id="zavantazhyty" class="scroll-mt-20 px-5 py-16 sm:px-8 lg:py-22">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
				{isUkrainian ? 'Що всередині' : 'Co znajdziesz w środku'}
			</p>
			<h2 class="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
				{isUkrainian
					? 'Два матеріали, до яких можна повертатися'
					: 'Dwa materiały, do których możesz wracać'}
			</h2>
			<div class="mt-9 grid gap-6 md:grid-cols-2">
				<article
					class="flex flex-col rounded-3xl border border-primary/15 bg-white p-7 shadow-sm sm:p-9"
				>
					<p class="text-sm font-bold text-accent">
						{isUkrainian ? '01 · ШІСТЬ СТОРІНОК' : '01 · SZEŚĆ STRON'}
					</p>
					<h3 class="mt-3 text-2xl font-semibold">
						{isUkrainian ? 'Коли думки не дають спокою' : 'Kiedy myśli nie dają spokoju'}
					</h3>
					<p class="mt-4 flex-1 leading-relaxed text-slate-600">
						{isUkrainian
							? 'Приклад того, як подія перетворюється на тривожний прогноз; пояснення різниці між фактом і припущенням; одна вправа та місце для власних записів.'
							: 'Przykład tego, jak zwykła sytuacja uruchamia niepokojące przewidywania. Wyjaśnienie różnicy między faktem a przypuszczeniem, jedno ćwiczenie i miejsce na własne notatki.'}
					</p>
					<a
						href={guide}
						download
						class="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90"
						>{isUkrainian ? 'Завантажити матеріал' : 'Pobierz przewodnik'}<span
							class="ml-3"
							aria-hidden="true">↓</span
						></a
					>
				</article>
				<article
					class="flex flex-col rounded-3xl border border-primary/15 bg-white p-7 shadow-sm sm:p-9"
				>
					<p class="text-sm font-bold text-accent">
						{isUkrainian ? '02 · ОДНА СТОРІНКА' : '02 · JEDNA STRONA'}
					</p>
					<h3 class="mt-3 text-2xl font-semibold">
						{isUkrainian ? 'Моя коротка опора при тривозі' : 'Moja karta wsparcia przy lęku'}
					</h3>
					<p class="mt-4 flex-1 leading-relaxed text-slate-600">
						{isUkrainian
							? 'Картка з трьома запитаннями: що я помічаю, що відбувається насправді й що мені потрібно зараз. Збережи в телефоні або роздрукуй.'
							: 'Karta z trzema pytaniami: co zauważam, co naprawdę się dzieje i czego teraz potrzebuję. Możesz zapisać ją w telefonie lub wydrukować.'}
					</p>
					{#if isUkrainian}
						<a
							href={card}
							download
							class="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-primary px-6 py-3 font-bold text-primary hover:bg-primary hover:text-white"
							>{isUkrainian ? 'Завантажити картку' : 'Pobierz kartę'}<span
								class="ml-3"
								aria-hidden="true">↓</span
							></a
						>
					{:else}<button
							disabled
							class="mt-7 min-h-12 rounded-xl border border-primary/30 px-6 py-3 font-bold text-primary/50"
							>Pobieranie karty w przygotowaniu</button
						>{/if}
				</article>
			</div>
		</div>
	</section>

	<section class="px-5 pb-16 sm:px-8">
		<div
			class="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-2"
		>
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
					{isUkrainian ? 'Як користуватися' : 'Jak korzystać z materiałów'}
				</p>
				<h2 class="mt-3 font-serif text-3xl">
					{isUkrainian ? 'Почни з посильної ситуації' : 'Zacznij od sytuacji, która nie przytłacza'}
				</h2>
			</div>
			<p class="leading-relaxed text-slate-600">
				{isUkrainian
					? 'Не потрібно виконувати вправу «правильно» або домагатися, щоб тривога одразу минула. Обери ситуацію з помірною напругою. Запиши лише те, що можеш зараз. Якщо увага до внутрішніх відчуттів посилює тривогу, пропусти цей крок і зверни увагу на предмети навколо.'
					: 'Nie musisz wykonywać ćwiczenia idealnie ani oczekiwać, że lęk od razu minie. Wybierz sytuację, która wywołuje umiarkowane napięcie. Zapisz tyle, ile możesz teraz. Jeśli skupianie się na odczuciach w ciele nasila niepokój, pomiń ten krok i skieruj uwagę na przedmioty wokół siebie.'}
			</p>
		</div>
	</section>

	<section class="bg-primary px-5 py-16 text-white sm:px-8">
		<div class="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-[1fr_auto]">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">
					{isUkrainian ? 'Якщо хочеш продовжити' : 'Jeśli chcesz kontynuować'}
				</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">
					<a
						href={book}
						class="underline decoration-secondary/60 underline-offset-4 hover:decoration-secondary"
						>{isUkrainian ? 'Коли тривога атакує' : 'Kiedy lęk atakuje'}</a
					>
				</h2>
				<p class="mt-5 max-w-2xl leading-relaxed text-white/85">
					{isUkrainian
						? 'У книзі-практикумі є 21 докладна практика про тривожні думки, напругу в тілі, вимоги до себе й підтримку в повсякденному житті. Вона також може бути додатковим матеріалом для психологів і психотерапевтів.'
						: 'W książce znajdziesz 21 szczegółowo opisanych ćwiczeń dotyczących niepokojących myśli, napięcia w ciele, wymagań wobec siebie i dbania o siebie na co dzień. Może być też dodatkowym materiałem w pracy psychologów i psychoterapeutów.'}
				</p>
				<p class="mt-4 font-bold text-secondary">
					{isUkrainian ? 'PDF · 75 сторінок · 49 zł' : 'PDF · 75 stron · 49 zł'}
				</p>
			</div>
			<a
				href={book}
				class="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 font-bold text-primary hover:bg-secondary"
				>{isUkrainian ? 'Дізнатися більше про книгу' : 'Zobacz książkę'}<span
					aria-hidden="true"
					class="ml-3">→</span
				></a
			>
		</div>
	</section>

	<section class="px-5 py-14 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<h2 class="font-serif text-2xl">{isUkrainian ? 'Про автора' : 'O autorce'}</h2>
			<p class="mt-4 max-w-3xl leading-relaxed text-slate-600">
				<strong class="text-primary">{isUkrainian ? 'Олеся Гайдук' : 'Olesya Haiduk'}</strong
				>{isUkrainian
					? '· психолог і психотерапевт. Працюю з тривогою, депресивними станами, розладами харчової поведінки, самооцінкою та труднощами у стосунках. Проводжу індивідуальні консультації й працюю з парами.'
					: '· psychoterapeutka. Pracuję z lękiem, obniżonym nastrojem, zaburzeniami odżywiania, samooceną i trudnościami w relacjach. Prowadzę konsultacje indywidualne i pracuję z parami.'}
			</p>
			<a
				href={isUkrainian ? '/uk/registrations' : '/pl/registrations'}
				class="mt-6 inline-block font-bold text-primary underline decoration-accent decoration-2 underline-offset-4"
				>{isUkrainian ? 'Записатися на консультацію' : 'Umów konsultację'}</a
			>
			<p class="mt-8 max-w-3xl text-sm leading-relaxed text-slate-500">
				{isUkrainian
					? 'Матеріали мають психоосвітній характер, не встановлюють діагнозів і не замінюють психотерапії чи медичної допомоги. Якщо є безпосередня загроза безпеці, звернися до місцевої екстреної служби.'
					: 'Materiały mają charakter psychoedukacyjny. Nie służą do stawiania diagnozy i nie zastępują psychoterapii ani opieki medycznej. W sytuacji bezpośredniego zagrożenia życia lub zdrowia skontaktuj się z lokalnymi służbami ratunkowymi.'}
			</p>
		</div>
	</section>
</div>
