<script lang="ts">
	import { Locale, path } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';
	import { sendGroupApplication } from '$remote/group-application.remote';
	import { remoteErrorIssues, remoteErrorMessage } from '$shared/global/functions/remote-error';
	import { tick } from 'svelte';
	import { createForm } from 'svelte-forms-lib';

	import { FIELD_MAP, FORM_INITIAL_VALUE, SCHEMA, type FormValue } from './model';

	const sessions = [
		{
			number: '01',
			title: 'Як я опинилася в цій точці?',
			text: "Подивимося на історію стосунків: з чого вони починалися, що змінилося і коли вперше з'явилася думка, що, можливо, я більше не хочу так жити."
		},
		{
			number: '02',
			title: 'Якою я стаю поруч із ним?',
			text: 'Що відбувається зі мною в цих стосунках? Чи можу я говорити про свої потреби, злитися, відмовляти, бути незручною? І що я роблю, коли боюся втратити близькість?'
		},
		{
			number: '03',
			title: 'Про що я мовчу у своїх стосунках?',
			text: 'Про те, що давно хочеться сказати, попросити або визнати, але з різних причин я цього не роблю.'
		},
		{
			number: '04',
			title: 'Чому ми сваримося по одному й тому самому сценарію?',
			text: 'Подивимося, як починаються наші конфлікти, що робить кожен із нас і чому після примирення ми часто знову повертаємося в ту саму точку.'
		},
		{
			number: '05',
			title: 'Де закінчується компроміс і починається відмова від себе?',
			text: 'Про власні межі, «ні», потреби й ситуації, у яких я погоджуюся на те, що насправді мені не підходить.'
		},
		{
			number: '06',
			title: 'А як хочу жити я?',
			text: 'Спробуємо на деякий час відвести увагу від того, що зробить або не зробить партнер, і повернути її до себе: яких стосунків і якого життя хочу я?'
		},
		{
			number: '07',
			title: 'Що я робитиму з тим, що тепер знаю?',
			text: "Зберемо те, що стало зрозумілішим за сім тижнів, і подивимося на наступні кроки. Не потрібно завершувати групу обов'язковим рішенням «залишаюся» або «йду»."
		}
	];

	const dates = [
		'05.11.2026',
		'12.11.2026',
		'19.11.2026',
		'26.11.2026',
		'03.12.2026',
		'10.12.2026',
		'17.12.2026'
	];

	const faqs = [
		{
			question: 'Чи потрібно вже планувати розставання, щоб прийти в групу?',
			answer:
				'Можна прийти саме з невизначеністю. Не потрібно заздалегідь знати, чи хочеш ти залишитися у стосунках, чи завершити їх.'
		},
		{
			question: 'А якщо під час групи я вирішу залишитися у стосунках?',
			answer:
				'Таке рішення теж може бути результатом участі. Група не має на меті підвести тебе до розставання, а допомагає краще зрозуміти себе та свої стосунки.'
		},
		{
			question: 'А якщо я не прийму рішення за сім тижнів?',
			answer:
				'Не обов’язково завершувати групу з остаточним рішенням. Важливіше краще зрозуміти себе, свої потреби й те, що відбувається у стосунках.'
		},
		{
			question: 'Чи будуть записи?',
			answer: 'Зустрічі не записуються, щоб зберегти приватність і безпеку групового простору.'
		},
		{
			question: 'Чи можна приєднатися після старту?',
			answer:
				'Після першої зустрічі група закривається. Постійний склад допомагає учасницям поступово знайомитися й почуватися безпечніше.'
		},
		{
			question: 'Чи потрібно спочатку приходити на індивідуальну консультацію?',
			answer:
				'Попередня індивідуальна консультація не потрібна. Спочатку достатньо заповнити коротку анкету. Якщо перед підтвердженням участі потрібно буде щось уточнити, я сама запропоную коротку розмову.'
		}
	];

	let isLoading = $state(false);
	let submitted = $state(false);
	let generalError = $state<string | null>(null);

	const { form, errors, touched, isValid, handleChange, handleSubmit, handleReset } = createForm({
		initialValues: FORM_INITIAL_VALUE,
		validationSchema: SCHEMA,
		async onSubmit(values) {
			isLoading = true;
			generalError = null;

			try {
				await sendGroupApplication({
					...values,
					age: Number(values.age),
					attendanceConfirmed: values.attendanceConfirmed as 'yes' | 'no',
					privatePlaceConfirmed: values.privatePlaceConfirmed as 'yes' | 'no',
					additionalInfo: values.additionalInfo || undefined
				});
				handleReset();
				submitted = true;
				await tick();
				document
					.getElementById('application')
					?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} catch (error) {
				const issues = remoteErrorIssues(error);
				if (Object.keys(issues).length > 0) {
					for (const [field, messages] of Object.entries(issues)) {
						const key = FIELD_MAP[field] ?? (field as keyof FormValue);
						errors.update((current) => ({ ...current, [key]: messages[0] }));
						touched.update((current) => ({ ...current, [key]: true }));
					}
				} else {
					generalError = remoteErrorMessage(error);
				}
			} finally {
				isLoading = false;
			}
		}
	});

	const inputClass =
		'mt-2 w-full rounded-xl border border-primary/25 bg-white px-4 py-3 text-primary outline-none transition placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent/20';
	const labelClass = 'block text-sm font-semibold leading-relaxed text-primary';
	const errorClass = 'mt-1.5 block text-sm text-danger';
</script>

<Seo
	title="Залишитись чи піти? Закрита онлайн-група для жінок"
	description="Закрита онлайн-група для жінок, які сумніваються, чи залишатися у стосунках. 7 зустрічей онлайн з 5 листопада до 17 грудня 2026 року."
	alternates={[{ locale: Locale.ukUA, path: '/zalyshytys-chy-pity' }]}
/>

<section class="bg-primary px-4 py-10 text-white sm:px-6 sm:py-14 lg:py-16">
	<div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:gap-12">
		<div>
			<p class="text-sm font-semibold tracking-[0.18em] text-accent uppercase">
				Закрита онлайн-група для жінок
			</p>
			<h1 class="mt-3 text-4xl leading-tight font-bold sm:text-5xl">Залишитись чи піти?</h1>
			<p class="mt-5 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
				Закрита онлайн-група для жінок, які вже не вперше думають про розставання, але щоразу
				повертаються до сумнівів.
			</p>
			<a
				href="#application"
				class="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 font-bold text-primary transition hover:bg-secondary"
				>Заповнити анкету</a
			>
		</div>
		<div
			class="rounded-2xl border border-secondary/30 bg-white/10 p-6 shadow-lg backdrop-blur-sm sm:p-7"
		>
			<p class="text-lg font-bold text-secondary">5 листопада – 17 грудня 2026</p>
			<p class="mt-3 leading-relaxed">Щочетверга · 18:30–20:00 Варшава<br />19:30–21:00 Київ</p>
			<div class="my-5 h-px bg-white/15"></div>
			<p>Google Meet · 7 зустрічей</p>
			<p class="mt-4 text-2xl font-bold text-secondary">690 zł за весь цикл</p>
		</div>
	</div>
</section>

<section class="bg-white px-4 py-12 text-primary sm:px-6 sm:py-16">
	<div class="mx-auto max-w-4xl">
		<h2 class="text-3xl leading-tight font-bold sm:text-4xl">
			Сьогодні ти думаєш: «Все, я більше не можу». А через кілька днів уже сумніваєшся.
		</h2>
		<div class="mt-6 space-y-4 text-lg leading-relaxed text-primary/80">
			<p>
				Після сварки здається, що цього разу точно треба щось змінювати. Потім стає спокійніше. Ви
				нормально розмовляєте, проводите разом вечір, між вами знову з'являється тепло.
			</p>
			<p>І ти думаєш: може, я перебільшую? Може, все ще можна виправити?</p>
			<p>А потім усе повторюється.</p>
			<p>
				І чим довше це триває, тим складніше зрозуміти не тільки, що робити зі стосунками, а й чого
				хочеш ти сама.
			</p>
			<p class="font-semibold text-primary">Саме про це ця група.</p>
		</div>
	</div>
</section>

<section class="bg-background px-4 py-12 text-primary sm:px-6 sm:py-16">
	<div class="mx-auto max-w-4xl rounded-3xl bg-white p-7 shadow-sm sm:p-10">
		<h2 class="text-3xl leading-tight font-bold sm:text-4xl">
			Тут не шукатимемо готової відповіді, як тобі вчинити
		</h2>
		<div class="mt-6 space-y-4 text-lg leading-relaxed text-primary/80">
			<p>
				Моє завдання не в тому, щоб переконувати тебе розлучатися або, навпаки, зберігати
				стосунки.
			</p>
			<p>
				За ці сім тижнів ми будемо більше дивитися не на питання «який він?», а на «що
				відбувається зі мною в цих стосунках?»
			</p>
			<p>
				Що я терплю і чому? Про що мовчу? Що відбувається зі мною під час конфлікту? Чого боюся
				попросити? Де погоджуюся, хоча насправді хочу сказати «ні»? І якими взагалі хочу бачити свої
				стосунки?
			</p>
		</div>
	</div>
</section>

<section class="bg-white px-4 py-12 text-primary sm:px-6 sm:py-16">
	<div class="mx-auto max-w-6xl">
		<p class="text-sm font-semibold tracking-[0.18em] text-accent uppercase">Програма</p>
		<h2 class="mt-2 text-3xl font-bold sm:text-4xl">7 зустрічей</h2>
		<div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each sessions as session, index (session.number)}
				<article
					class={`rounded-2xl border border-primary/10 p-6 ${index === sessions.length - 1 ? 'bg-primary text-white md:col-span-2 lg:col-span-1' : 'bg-background'}`}
				>
					<p
						class={`text-sm font-bold tracking-[0.14em] ${index === sessions.length - 1 ? 'text-secondary' : 'text-accent'}`}
					>
						{session.number}
					</p>
					<h3 class="mt-3 text-xl leading-snug font-bold">{session.title}</h3>
					<p
						class={`mt-3 leading-relaxed ${index === sessions.length - 1 ? 'text-white/80' : 'text-primary/75'}`}
					>
						{session.text}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="bg-background px-4 py-12 text-primary sm:px-6 sm:py-16">
	<div class="mx-auto max-w-6xl">
		<h2 class="text-3xl font-bold sm:text-4xl">Формат</h2>
		<div class="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{#each ['7 щотижневих зустрічей', '90 хвилин', 'Google Meet', '6–8 учасниць', 'закрита група', 'без записів'] as item}
				<div
					class="flex min-h-24 items-center justify-center rounded-2xl bg-primary px-4 py-5 text-center font-semibold text-white"
				>
					{item}
				</div>
			{/each}
		</div>
		<div class="mt-7 grid gap-4 text-lg leading-relaxed lg:grid-cols-2">
			<p class="rounded-2xl bg-white p-6">Після початку нові учасниці не приєднуються.</p>
			<p class="rounded-2xl bg-white p-6">
				На зустрічах буде групова розмова, практичні вправи, психоедукація та робота з тим, що
				виникає безпосередньо в групі.
			</p>
		</div>
	</div>
</section>

<section class="bg-primary px-4 py-12 text-white sm:px-6 sm:py-16">
	<div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
		<div>
			<h2 class="text-3xl font-bold sm:text-4xl">Дати і вартість</h2>
			<div class="mt-6 flex flex-wrap gap-2">
				{#each dates as date}
					<span
						class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold"
						>{date}</span
					>
				{/each}
			</div>
			<p class="mt-5 leading-relaxed text-white/80">
				Щочетверга, 18:30–20:00 Варшава / 19:30–21:00 Київ.
			</p>
		</div>
		<div class="lg:text-right">
			<p class="text-3xl font-bold text-secondary">690 zł</p>
			<p class="mt-1 text-white/75">за весь цикл</p>
			<a
				href="#application"
				class="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-7 py-3 font-bold text-primary transition hover:bg-secondary"
				>Заповнити анкету</a
			>
		</div>
	</div>
</section>

<section class="bg-white px-4 py-12 text-primary sm:px-6 sm:py-16">
	<div class="mx-auto max-w-4xl">
		<h2 class="text-3xl font-bold sm:text-4xl">Поширені запитання</h2>
		<div class="mt-7 space-y-3">
			{#each faqs as faq}
				<details
					class="group rounded-2xl border border-primary/10 bg-background px-5 py-4 open:border-accent/50"
				>
					<summary
						class="flex cursor-pointer list-none items-center justify-between gap-4 leading-relaxed font-semibold"
					>
						{faq.question}<span
							class="text-2xl font-light text-accent transition group-open:rotate-45"
							aria-hidden="true">+</span
						>
					</summary>
					<p class="mt-3 pr-8 leading-relaxed text-primary/75">{faq.answer}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<section
	id="application"
	class="scroll-mt-24 bg-background px-4 py-12 text-primary sm:px-6 sm:py-16"
>
	<div class="mx-auto max-w-3xl">
		{#if submitted}
			<div class="rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12" role="status">
				<div
					class="mx-auto grid size-14 place-items-center rounded-full bg-accent text-2xl text-primary"
				>
					<i class="fa-solid fa-check" aria-hidden="true"></i>
				</div>
				<h2 class="mt-5 text-3xl font-bold">Дякую за заявку.</h2>
				<p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-primary/75">
					Я особисто її перегляну і зв'яжуся з тобою щодо участі та оплати. Якщо перед
					підтвердженням участі мені потрібно буде щось уточнити, я запропоную коротку розмову.
				</p>
				<a
					href={path('/home')}
					class="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-primary/20 px-6 py-2.5 font-semibold transition hover:bg-background"
					>Повернутися на головну</a
				>
			</div>
		{:else}
			<div class="mb-8 text-center">
				<p class="text-sm font-semibold tracking-[0.18em] text-accent uppercase">Анкета участі</p>
				<h2 class="mt-2 text-3xl font-bold sm:text-4xl">Заповнити анкету</h2>
				<p class="mx-auto mt-3 max-w-2xl leading-relaxed text-primary/70">
					Заповнення анкети не означає автоматичного зарахування до групи. Після перегляду я
					особисто зв'яжуся з тобою.
				</p>
			</div>
			<form onsubmit={handleSubmit} class="rounded-3xl bg-white p-6 shadow-sm sm:p-9" novalidate>
				<div class="grid gap-5 sm:grid-cols-2">
					<div>
						<label for="name" class={labelClass}>Ім'я</label>
						<input
							id="name"
							name="name"
							type="text"
							bind:value={$form.name}
							onchange={handleChange}
							onblur={handleChange}
							class={inputClass}
							autocomplete="name"
						/>
						{#if $errors.name && $touched.name}<small class={errorClass}>{$errors.name}</small>{/if}
					</div>
					<div>
						<label for="age" class={labelClass}>Вік</label>
						<input
							id="age"
							name="age"
							type="number"
							min="1"
							inputmode="numeric"
							bind:value={$form.age}
							onchange={handleChange}
							onblur={handleChange}
							class={inputClass}
						/>
						{#if $errors.age && $touched.age}<small class={errorClass}>{$errors.age}</small>{/if}
					</div>
					<div>
						<label for="email" class={labelClass}>E-mail</label>
						<input
							id="email"
							name="email"
							type="email"
							bind:value={$form.email}
							onchange={handleChange}
							onblur={handleChange}
							class={inputClass}
							autocomplete="email"
						/>
						{#if $errors.email && $touched.email}<small class={errorClass}>{$errors.email}</small
							>{/if}
					</div>
					<div>
						<label for="contact" class={labelClass}>Telegram або номер телефону</label>
						<input
							id="contact"
							name="contact"
							type="text"
							bind:value={$form.contact}
							onchange={handleChange}
							onblur={handleChange}
							class={inputClass}
							autocomplete="tel"
						/>
						{#if $errors.contact && $touched.contact}<small class={errorClass}
								>{$errors.contact}</small
							>{/if}
					</div>
				</div>

				<div class="mt-6 space-y-6">
					{#each [{ name: 'relationshipSituation', label: 'Розкажи коротко, що зараз відбувається у твоїх стосунках.' }, { name: 'hardestPart', label: 'Що в цій ситуації зараз найскладніше для тебе?' }, { name: 'expectations', label: 'Чого ти очікуєш від участі в групі?' }, { name: 'currentHelp', label: 'Чи отримуєш ти зараз психологічну, психотерапевтичну або психіатричну допомогу? Якщо так, напиши коротко, яку саме.' }] as field}
						<div>
							<label for={field.name} class={labelClass}>{field.label}</label>
							<textarea
								id={field.name}
								name={field.name}
								rows="4"
								bind:value={$form[field.name as keyof FormValue]}
								onchange={handleChange}
								onblur={handleChange}
								class={inputClass}
							></textarea>
							{#if $errors[field.name as keyof FormValue] && $touched[field.name as keyof FormValue]}<small
									class={errorClass}>{$errors[field.name as keyof FormValue]}</small
								>{/if}
						</div>
					{/each}

					<fieldset>
						<legend class={labelClass}
							>Чи зможеш ти регулярно брати участь у всіх 7 зустрічах щочетверга, 18:30–20:00 за
							Варшавою / 19:30–21:00 за Києвом?</legend
						>
						<div class="mt-3 flex gap-5">
							<label class="flex items-center gap-2"
								><input
									type="radio"
									name="attendanceConfirmed"
									value="yes"
									bind:group={$form.attendanceConfirmed}
									onchange={handleChange}
								/> Так</label
							>
							<label class="flex items-center gap-2"
								><input
									type="radio"
									name="attendanceConfirmed"
									value="no"
									bind:group={$form.attendanceConfirmed}
									onchange={handleChange}
								/> Ні</label
							>
						</div>
						{#if $errors.attendanceConfirmed && $touched.attendanceConfirmed}<small
								class={errorClass}>{$errors.attendanceConfirmed}</small
							>{/if}
					</fieldset>

					<fieldset>
						<legend class={labelClass}
							>Чи матимеш під час зустрічей приватне місце, де зможеш спокійно говорити?</legend
						>
						<div class="mt-3 flex gap-5">
							<label class="flex items-center gap-2"
								><input
									type="radio"
									name="privatePlaceConfirmed"
									value="yes"
									bind:group={$form.privatePlaceConfirmed}
									onchange={handleChange}
								/> Так</label
							>
							<label class="flex items-center gap-2"
								><input
									type="radio"
									name="privatePlaceConfirmed"
									value="no"
									bind:group={$form.privatePlaceConfirmed}
									onchange={handleChange}
								/> Ні</label
							>
						</div>
						{#if $errors.privatePlaceConfirmed && $touched.privatePlaceConfirmed}<small
								class={errorClass}>{$errors.privatePlaceConfirmed}</small
							>{/if}
					</fieldset>

					<div>
						<label for="additionalInfo" class={labelClass}
							>Чи є ще щось важливе, що ти хочеш повідомити мені перед участю? <span
								class="font-normal text-primary/50">(необов'язково)</span
							></label
						>
						<textarea
							id="additionalInfo"
							name="additionalInfo"
							rows="4"
							bind:value={$form.additionalInfo}
							onchange={handleChange}
							onblur={handleChange}
							class={inputClass}
						></textarea>
						{#if $errors.additionalInfo && $touched.additionalInfo}<small class={errorClass}
								>{$errors.additionalInfo}</small
							>{/if}
					</div>

					<div>
						<label class="flex items-start gap-3 text-sm leading-relaxed text-primary/75">
							<input
								type="checkbox"
								name="consent"
								bind:checked={$form.consent}
								onchange={handleChange}
								class="mt-1 rounded border-primary/30 text-primary focus:ring-accent"
							/>
							<span
								>Погоджуюся на обробку наданих у цій анкеті даних для розгляду моєї заявки та
								зв'язку щодо участі в групі. Детальніше у <a
									href={path('/gdpr')}
									class="font-semibold underline underline-offset-2">політиці конфіденційності</a
								>.</span
							>
						</label>
						{#if $errors.consent && $touched.consent}<small class={errorClass}
								>{$errors.consent}</small
							>{/if}
					</div>
				</div>

				{#if generalError}<p
						class="mt-5 rounded-xl bg-danger/10 p-4 text-sm text-danger"
						role="alert"
					>
						{generalError}
					</p>{/if}
				<button
					type="submit"
					disabled={isLoading || !$isValid}
					class="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-7 py-3 font-bold text-primary transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? 'Надсилаю…' : 'Надіслати анкету'}
				</button>
				<p class="mt-3 text-center text-sm leading-relaxed text-primary/55">
					Анкета не веде на оплату і не означає автоматичного зарахування до групи.
				</p>
			</form>
		{/if}
	</div>
</section>
