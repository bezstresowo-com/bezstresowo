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
			const response = await fetch('/api/books/checkout', { method: 'POST' });
			const result = await response.json();
			if (!response.ok || !result.url) throw new Error('Checkout unavailable');
			window.location.assign(result.url);
		} catch {
			checkoutError =
				'Не вдалося відкрити оплату. Спробуй пізніше або напиши на bezstresowo.org@gmail.com.';
			buying = false;
		}
	}

	const topics = [
		{
			number: '01',
			title: 'Помічати свій стан і знаходити опору',
			text: 'Як саме проявляється твоя тривога? Що допомагає трохи повернути увагу до себе й того, що є навколо?'
		},
		{
			number: '02',
			title: 'Думки, вимоги до себе й особисті межі',
			text: 'Тривожні припущення, поспіх, прагнення зробити все бездоганно та місце для власних потреб.'
		},
		{
			number: '03',
			title: 'Підтримка в повсякденному житті',
			text: 'Доступні способи підтримки, межі твого впливу й короткий план, до якого можна повертатися.'
		}
	];
</script>

<Seo
	title="Коли тривога атакує: книга-практикум, 21 практика | Bezstresowo"
	description="Електронна книга Олесі Гайдук про тривожні думки, напругу й підтримку себе. 21 докладна практика у власному темпі. PDF, 75 сторінок, 49 zł."
	noindex
/>

<div class="bg-background text-primary">
	<section class="px-5 py-16 sm:px-8 lg:py-24">
		<div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
			<div class="mx-auto w-full max-w-sm">
				<img
					src="/assets/koly-tryvoha-atakuie-cover-ua.webp"
					alt="Обкладинка книги «Коли тривога атакує»"
					class="aspect-[.707] w-full rounded-xl object-cover shadow-2xl shadow-primary/20"
					width="893"
					height="1263"
				/>
			</div>
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">
					Книга-практикум · PDF
				</p>
				<h1 class="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Коли тривога атакує</h1>
				<p class="mt-4 text-xl font-semibold">
					21 практика, щоб зрозуміти свій стан і знайти опору
				</p>
				<p class="mt-6 max-w-xl leading-relaxed text-slate-600">
					Буває, що одна тривожна думка тягне за собою десяток інших. Ти намагаєшся все передбачити
					й втомлюєшся навіть тоді, коли нічого поганого ще не сталося.
				</p>
				<p class="mt-4 max-w-xl leading-relaxed text-slate-600">
					У книзі є пояснення, приклади, докладні кроки й місце для власних записів. Вона допоможе
					придивитися до свого стану та спробувати способи підтримки у власному темпі.
				</p>
				<div class="mt-8 flex flex-wrap items-center gap-5">
					<strong class="text-3xl">49 zł</strong>
					<span class="text-sm text-slate-500">75 сторінок · електронна книга у PDF</span>
				</div>
				<button
					type="button"
					disabled={!data.bookSalesReady || buying}
					onclick={buyBook}
					class="mt-6 min-h-12 rounded-xl bg-accent px-8 py-3 font-bold text-primary disabled:cursor-not-allowed disabled:opacity-65"
					>{buying ? 'Відкриваю оплату…' : 'Купити книгу за 49 zł'}</button
				>
				<p class="mt-3 text-sm text-slate-500">
					{data.bookSalesReady
						? 'Після підтвердження оплати на твій email надійде посилання на завантаження PDF.'
						: 'Продаж книги готується. Незабаром тут можна буде оплатити й отримати PDF на email.'}
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
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">Для кого</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">Знайомий стан?</h2>
			</div>
			<div class="space-y-4 leading-relaxed text-slate-600">
				<p>
					Для жінок, які часто помічають тривожні прогнози, напругу, бажання все контролювати або
					складність із відпочинком. Для тих, хто хоче розуміти свій стан і спробувати працювати з
					ним у власному темпі.
				</p>
				<p>
					Тобі не потрібно мати діагноз або виконувати всі вправи поспіль. Можна обрати тему, яка
					зараз відгукується, зробити паузу й продовжити згодом.
				</p>
			</div>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">Що всередині</p>
			<h2 class="mt-3 font-serif text-3xl sm:text-4xl">Три частини, 21 практика</h2>
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
				Кожна практика має пояснення, кроки виконання та сторінку для записів. Наприкінці є короткий
				план підтримки, який можна заповнити для себе.
			</p>
		</div>
	</section>

	<section class="bg-primary px-5 py-16 text-white sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">Для фахівців</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">Матеріал для роботи з клієнтками</h2>
			</div>
			<p class="leading-relaxed text-white/85">
				Психологи й психотерапевти можуть використовувати книгу як додатковий психоосвітній
				матеріал: обирати окремі практики для обговорення та пропонувати сторінки для записів між
				зустрічами. Фахівець сам вирішує, чи підходить конкретна вправа людині та її ситуації. Книга
				не є готовим протоколом лікування тривожних розладів.
			</p>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">Як працювати</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">У своєму темпі</h2>
			</div>
			<div class="space-y-4 leading-relaxed text-slate-600">
				<p>
					«21 практика» описує структуру книги, а не термін, за який ти маєш змінитися. Для однієї
					теми можна виділити приблизно 15–25 хвилин або розділити її на кілька підходів.
				</p>
				<p>
					Сторінки для записів можна заповнювати після друку. Якщо читаєш із телефону чи планшета,
					підійдуть нотатки або окремий зошит. PDF не має полів для введення тексту.
				</p>
				<p>
					Якщо якась вправа посилює напругу, її можна скоротити, змінити або пропустити. У книзі
					описано межі самодопомоги та ситуації, коли варто звернутися по професійну допомогу.
				</p>
			</div>
		</div>
	</section>

	<section class="bg-white px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<h2 class="font-serif text-3xl">Поширені запитання</h2>
			<div class="mt-8 grid gap-6 md:grid-cols-2">
				<div>
					<h3 class="font-semibold">Чи потрібно пройти книгу за 21 день?</h3>
					<p class="mt-2 text-slate-600">
						Ні. Можна рухатися у своєму темпі, повторювати окремі практики й робити перерви.
					</p>
				</div>
				<div>
					<h3 class="font-semibold">Чи підійде книга, якщо я вже проходжу психотерапію?</h3>
					<p class="mt-2 text-slate-600">
						Можеш обговорити зі своїм фахівцем, які вправи будуть доречними для твоєї роботи.
					</p>
				</div>
				<div>
					<h3 class="font-semibold">Чи можна заповнювати PDF на телефоні?</h3>
					<p class="mt-2 text-slate-600">
						У файлі немає інтерактивних полів. Записи можна робити в нотатках або в застосунку для
						позначок на PDF.
					</p>
				</div>
				<div>
					<h3 class="font-semibold">Чи допоможе книга позбутися тривоги?</h3>
					<p class="mt-2 text-slate-600">
						Книга не обіцяє зникнення тривоги. Вона допомагає краще помічати свій стан і пробувати
						способи підтримки.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-8">
		<div class="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-white p-8 sm:p-12">
			<h2 class="font-serif text-3xl">Про автора</h2>
			<p class="mt-4 max-w-3xl leading-relaxed text-slate-600">
				<strong class="text-primary">Олеся Гайдук</strong> · психолог і психотерапевт. Працюю з тривогою,
				депресивними станами, розладами харчової поведінки, самооцінкою та труднощами у стосунках. Проводжу
				індивідуальні консультації й працюю з парами.
			</p>
			<p class="mt-4 max-w-3xl leading-relaxed text-slate-600">
				Якщо хочеш розібрати конкретну ситуацію разом зі мною, можеш записатися на індивідуальну
				консультацію. Купувати або завершувати книгу перед цим не потрібно.
			</p>
			<a
				href="/uk/registrations"
				class="mt-6 inline-block font-bold underline decoration-accent decoration-2 underline-offset-4"
				>Записатися на консультацію</a
			>
			<p class="mt-8 max-w-3xl text-sm leading-relaxed text-slate-500">
				Книга має психоосвітній характер, не встановлює діагнозів і не замінює психотерапії чи
				медичної допомоги. Нові або сильні фізичні симптоми потребують медичної оцінки. Якщо є
				безпосередня загроза безпеці, звернися до місцевої екстреної служби.
			</p>
		</div>
	</section>
</div>
