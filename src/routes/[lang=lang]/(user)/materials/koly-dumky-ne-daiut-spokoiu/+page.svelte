<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';

	const guide = '/documents/koly-dumky-ne-daiut-spokoiu-ua.pdf';
	const card = '/documents/moia-korotka-opora-pry-tryvozi-ua.pdf';
	const book = '/uk/materials/koly-tryvoha-atakuie';
</script>

<Seo
	title="Коли думки не дають спокою: безкоштовна вправа | Bezstresowo"
	description="Безкоштовний матеріал про тривожні думки та картка для збереження. Поміть свою тривожну спіраль і спробуй одну вправу у власному темпі."
	noindex
/>

<div class="bg-background text-primary">
	<section class="relative overflow-hidden bg-primary px-5 py-20 text-white sm:px-8 lg:py-28">
		<div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
			<div class="relative z-10">
				<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">
					Безкоштовні матеріали
				</p>
				<h1 class="mt-5 max-w-3xl text-4xl leading-[1.1] font-semibold sm:text-5xl lg:text-6xl">
					Коли думки не дають спокою
				</h1>
				<p class="mt-7 max-w-2xl text-lg leading-relaxed text-white/85">
					«А раптом щось станеться?» «Що, як я помилилася?» Іноді одне запитання тягне за собою
					наступне, а тривога стає дедалі сильнішою.
				</p>
				<p class="mt-4 max-w-2xl leading-relaxed text-white/80">
					Я підготувала короткий матеріал, який допоможе помітити, як розгортається тривожна думка,
					і спробувати одну вправу на власній ситуації.
				</p>
				<a
					href="#zavantazhyty"
					class="mt-8 inline-flex min-h-12 items-center rounded-xl bg-accent px-7 py-3 font-bold text-primary transition hover:bg-secondary"
				>
					Завантажити безкоштовно <span aria-hidden="true" class="ml-3">↘</span>
				</a>
				<p class="mt-3 text-sm text-white/65">
					Два PDF-файли. Без реєстрації та електронної адреси.
				</p>
			</div>
			<div class="relative mx-auto w-full max-w-sm" aria-hidden="true">
				<div
					class="relative aspect-[.705] overflow-hidden rounded-2xl border border-white/20 bg-primary p-9 shadow-2xl shadow-black/25"
				>
					<p class="text-xs font-bold tracking-widest">BEZSTRESOWO</p>
					<p class="mt-10 font-serif text-4xl leading-tight">
						Коли думки<br />не дають<br />спокою
					</p>
					<svg
						class="absolute right-4 bottom-22 h-56 w-72 opacity-70"
						viewBox="0 0 290 230"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M261 55C223 13 111 1 50 55-10 107 6 196 100 211c89 14 135-38 170-44"
							stroke="#e5ae31"
						/>
						<path
							d="M247 67C209 28 118 19 64 64c-55 45-42 122 40 135 74 12 116-33 151-44"
							stroke="#f3f0e7"
							opacity=".55"
						/>
						<path
							d="M231 79C196 44 122 36 77 72c-44 36-31 101 33 113 64 12 98-27 133-42"
							stroke="#f3f0e7"
							opacity=".55"
						/>
						<path
							d="M216 89C185 59 128 55 91 82c-34 27-25 79 26 89 48 9 79-21 107-36"
							stroke="#e5ae31"
						/>
						<path
							d="M198 101c-25-24-65-30-93-9-24 18-18 57 17 65 34 8 60-16 83-31"
							stroke="#f3f0e7"
							opacity=".55"
						/>
					</svg>
					<p class="absolute bottom-9 left-9 text-sm leading-snug text-white/80">
						Коротка карта тривожної спіралі<br />та одна практика для себе
					</p>
				</div>
			</div>
		</div>
	</section>

	<section id="zavantazhyty" class="scroll-mt-20 px-5 py-16 sm:px-8 lg:py-22">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">Що всередині</p>
			<h2 class="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
				Два матеріали, до яких можна повертатися
			</h2>
			<div class="mt-9 grid gap-6 md:grid-cols-2">
				<article
					class="flex flex-col rounded-3xl border border-primary/15 bg-white p-7 shadow-sm sm:p-9"
				>
					<p class="text-sm font-bold text-accent">01 · ШІСТЬ СТОРІНОК</p>
					<h3 class="mt-3 text-2xl font-semibold">Коли думки не дають спокою</h3>
					<p class="mt-4 flex-1 leading-relaxed text-slate-600">
						Приклад того, як подія перетворюється на тривожний прогноз; пояснення різниці між фактом
						і припущенням; одна вправа та місце для власних записів.
					</p>
					<a
						href={guide}
						download
						class="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90"
						>Завантажити матеріал <span class="ml-3" aria-hidden="true">↓</span></a
					>
				</article>
				<article
					class="flex flex-col rounded-3xl border border-primary/15 bg-white p-7 shadow-sm sm:p-9"
				>
					<p class="text-sm font-bold text-accent">02 · ОДНА СТОРІНКА</p>
					<h3 class="mt-3 text-2xl font-semibold">Моя коротка опора при тривозі</h3>
					<p class="mt-4 flex-1 leading-relaxed text-slate-600">
						Картка з трьома запитаннями: що я помічаю, що відбувається насправді й що мені потрібно
						зараз. Збережи в телефоні або роздрукуй.
					</p>
					<a
						href={card}
						download
						class="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-primary px-6 py-3 font-bold text-primary hover:bg-primary hover:text-white"
						>Завантажити картку <span class="ml-3" aria-hidden="true">↓</span></a
					>
				</article>
			</div>
		</div>
	</section>

	<section class="px-5 pb-16 sm:px-8">
		<div
			class="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-2"
		>
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-accent uppercase">Як користуватися</p>
				<h2 class="mt-3 font-serif text-3xl">Почни з посильної ситуації</h2>
			</div>
			<p class="leading-relaxed text-slate-600">
				Не потрібно виконувати вправу «правильно» або домагатися, щоб тривога одразу минула. Обери
				ситуацію з помірною напругою. Запиши лише те, що можеш зараз. Якщо увага до внутрішніх
				відчуттів посилює тривогу, пропусти цей крок і зверни увагу на предмети навколо.
			</p>
		</div>
	</section>

	<section class="bg-primary px-5 py-16 text-white sm:px-8">
		<div class="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-[1fr_auto]">
			<div>
				<p class="text-xs font-bold tracking-[.18em] text-secondary uppercase">
					Якщо хочеш продовжити
				</p>
				<h2 class="mt-3 font-serif text-3xl sm:text-4xl">
					<a
						href={book}
						class="underline decoration-secondary/60 underline-offset-4 hover:decoration-secondary"
						>Коли тривога атакує</a
					>
				</h2>
				<p class="mt-5 max-w-2xl leading-relaxed text-white/85">
					У книзі-практикумі є 21 докладна практика про тривожні думки, напругу в тілі, вимоги до
					себе й підтримку в повсякденному житті. Вона також може бути додатковим матеріалом для
					психологів і психотерапевтів.
				</p>
				<p class="mt-4 font-bold text-secondary">PDF · 75 сторінок · 49 zł</p>
			</div>
			<a
				href={book}
				class="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 font-bold text-primary hover:bg-secondary"
				>Дізнатися більше про книгу <span aria-hidden="true" class="ml-3">→</span></a
			>
		</div>
	</section>

	<section class="px-5 py-14 sm:px-8">
		<div class="mx-auto max-w-6xl">
			<h2 class="font-serif text-2xl">Про автора</h2>
			<p class="mt-4 max-w-3xl leading-relaxed text-slate-600">
				<strong class="text-primary">Олеся Гайдук</strong> · психолог і психотерапевт. Працюю з тривогою,
				депресивними станами, розладами харчової поведінки, самооцінкою та труднощами у стосунках. Проводжу
				індивідуальні консультації й працюю з парами.
			</p>
			<a
				href="/uk/registrations"
				class="mt-6 inline-block font-bold text-primary underline decoration-accent decoration-2 underline-offset-4"
				>Записатися на консультацію</a
			>
			<p class="mt-8 max-w-3xl text-sm leading-relaxed text-slate-500">
				Матеріали мають психоосвітній характер, не встановлюють діагнозів і не замінюють
				психотерапії чи медичної допомоги. Якщо є безпосередня загроза безпеці, звернися до місцевої
				екстреної служби.
			</p>
		</div>
	</section>
</div>
