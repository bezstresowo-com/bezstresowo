<script lang="ts">
	import Seo from '$lib/Seo/Seo.svelte';

	const modules = [
		['01', 'Я не можу прийняти рішення', 'Почуєш обидві частини внутрішнього конфлікту й побачиш, звідки походять аргументи «залишитися» та «піти».'],
		['02', 'Які мої стосунки насправді?', 'Подивишся на останні 12 місяців і повторювані цикли, а не лише на останню сварку чи примирення.'],
		['03', 'Криза, чи це вже звичний спосіб бути разом?', 'Звернеш увагу на те, що відбувається після проблеми: відповідальність, дії та реальні зміни.'],
		['04', 'Що мене тут тримає?', 'Розділиш любов, прив’язаність, страх втрати, спільне життя, надію та образ стосунків, якими вони колись були.'],
		['05', 'Факти й надія', 'Відокремиш те, що вже можна побачити в поведінці, від того, на що все ще сподіваєшся.'],
		['06', 'Два можливі життя', 'Подивишся на ціну й можливості обох варіантів та сформулюєш конкретні умови, за яких хотіла б залишитися.'],
		['07', 'Моє рішення', 'Збереш усе в Мапу рішення: факти, страхи, межі, потреби, умови змін і можливі наступні кроки.']
	];

	const situations = [
		'Ти вже не вперше думаєш про розрив, але щоразу зупиняєшся.',
		'Після конфлікту здається, що так більше не можна, а після примирення знову з’являється надія.',
		'Ти любиш людину, але не впевнена, що хочеш і далі жити саме в таких стосунках.',
		'Тобі важко зрозуміти, де факти, а де страх, провина, звичка або надія на зміни.',
		'Ти боїшся піти й пожалкувати. Але так само боїшся залишитися й через кілька років опинитися в тій самій точці.'
	];
</script>

<Seo
	title="Криза чи кінець? | Bezstresowo"
	description="Програма для самостійної роботи, коли ти більше не знаєш, залишатися чи йти. 7 модулів, робочий зошит, Мапа рішення та короткі аудіо."
/>

<svelte:head>
	<meta property="og:title" content="Криза чи кінець? — Bezstresowo" />
	<meta property="og:description" content="Коли ти більше не знаєш, залишатися чи йти." />
</svelte:head>

<div class="landing">
	<section class="hero">
		<div class="hero-glow"></div>
		<div class="hero-inner">
			<div class="eyebrow">BEZSTRESOWO · ПРОГРАМА ДЛЯ САМОСТІЙНОЇ РОБОТИ</div>
			<h1>Криза<br /><em>чи кінець?</em></h1>
			<p class="hero-copy">Коли ти більше не знаєш, залишатися чи йти.</p>
			<p class="hero-sub">Програма, яка допоможе розкласти по місцях факти, почуття, страхи, надію та власні межі — без тесту на сумісність і без чужого рішення за тебе.</p>
			<a class="cta primary" href="#program">Подивитися, що всередині</a>
			<p class="micro">7 модулів · Workbook · Мапа рішення · 5 коротких аудіо</p>
		</div>
		<div class="hero-card">
			<div class="card-line"></div>
			<span>РОБОЧИЙ ЗОШИТ</span>
			<strong>Криза<br />чи кінець?</strong>
			<p>Твоя Мапа рішення</p>
			<div class="gold-dot"></div>
		</div>
	</section>

	<section class="recognition">
		<div class="section-label">МОЖЛИВО, ТИ ВПІЗНАЄШ СЕБЕ</div>
		<div class="recognition-grid">
			<div>
				<h2>«Я вже не розумію,<br />що мені робити»</h2>
				<p class="lead">Іноді найважче не саме рішення. Найважче те, що всередині одночасно живуть дві правди.</p>
			</div>
			<div class="situations">
				{#each situations as item}
					<div class="situation"><span>✦</span><p>{item}</p></div>
				{/each}
			</div>
		</div>
	</section>

	<section class="statement">
		<p>Ця програма не скаже тобі, <em>чи потрібно розходитися.</em></p>
		<h2>Вона допоможе побачити твої стосунки такими, якими вони є зараз.</h2>
	</section>

	<section class="program" id="program">
		<div class="section-label">ЩО ВСЕРЕДИНІ</div>
		<div class="program-head">
			<h2>7 кроків від внутрішнього хаосу<br />до яснішої картини</h2>
			<p>Проходь у власному темпі. Не потрібно завершувати все за один вечір.</p>
		</div>
		<div class="modules">
			{#each modules as module}
				<article>
					<div class="module-no">{module[0]}</div>
					<div><h3>{module[1]}</h3><p>{module[2]}</p></div>
				</article>
			{/each}
		</div>
	</section>

	<section class="inside">
		<div>
			<div class="section-label light">ФОРМАТ</div>
			<h2>Усе, що потрібно для самостійної роботи</h2>
		</div>
		<div class="format-grid">
			<div><b>01</b><h3>Особистий кабінет</h3><p>Послідовна структура програми в Bezstresowo / SendPulse.</p></div>
			<div><b>02</b><h3>Робочий зошит</h3><p>Вправи, таблиці й запитання, до яких можна повертатися.</p></div>
			<div><b>03</b><h3>5 коротких аудіо</h3><p>Мої пояснення перед ключовими етапами роботи.</p></div>
			<div><b>04</b><h3>Мапа рішення</h3><p>Фінальна структура, де все важливе опиняється перед очима.</p></div>
		</div>
	</section>

	<section class="result">
		<div class="result-box">
			<div class="section-label">ПІСЛЯ ПРОГРАМИ</div>
			<h2>Тобі не обов’язково мати готове рішення.</h2>
			<p>Але замість одного великого «я не знаю» в тебе буде значно ясніша картина: що насправді відбувається, що тебе тримає, чого ти боїшся, що вже не підходить і що мало б змінитися, щоб ти хотіла залишитися.</p>
			<p class="quote">«Якби мені не потрібно було приймати рішення сьогодні, яку правду про свої стосунки я вже готова собі визнати?»</p>
		</div>
	</section>

	<section class="author">
		<div class="author-mark">OH</div>
		<div>
			<div class="section-label">АВТОР ПРОГРАМИ</div>
			<h2>Olesya Haiduk</h2>
			<p>Психолог і психотерапевт. Працюю в напрямі Транзакційного Аналізу з темами стосунків, криз, співзалежності, самооцінки та складних рішень.</p>
			<p class="note">Програма має психоосвітній характер і не є психотерапією, діагностикою або індивідуальною рекомендацією щодо продовження чи завершення стосунків.</p>
		</div>
	</section>

	<section class="purchase" id="purchase">
		<div>
			<div class="section-label light">ДОСТУП ДО ПРОГРАМИ</div>
			<h2>Криза чи кінець?</h2>
			<p>7 модулів · Workbook · Мапа рішення · 5 аудіо · доступ у власному темпі</p>
		</div>
		<div class="price-card">
			<span>Стартова ціна</span>
			<strong>79 zł</strong>
			<button class="cta primary" type="button" disabled>Купити програму</button>
			<small>Кнопку оплати активуємо після підключення продукту до магазину.</small>
		</div>
	</section>

	<section class="safety">
		<h3>Важливо</h3>
		<p>Якщо у стосунках є насильство, погрози, примус, переслідування або реальна небезпека, першочерговим питанням є безпека. Самостійна робота з програмою в такій ситуації не замінює спеціалізованої допомоги.</p>
	</section>
</div>

<style>
	:global(body){background:#F3F0E7}
	.landing{--navy:#22344E;--gold:#E5AE31;--sand:#FDD896;--cream:#F3F0E7;color:var(--navy);font-family:inherit;overflow:hidden}
	.hero{min-height:720px;background:var(--navy);color:white;position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.65fr);gap:70px;align-items:center;padding:90px clamp(24px,7vw,110px)}
	.hero-glow{position:absolute;width:560px;height:560px;border-radius:50%;right:-100px;top:-180px;background:radial-gradient(circle,rgba(229,174,49,.22),transparent 68%)}
	.hero-inner,.hero-card{position:relative;z-index:1}.eyebrow,.section-label{font-size:12px;letter-spacing:.18em;font-weight:700;color:var(--gold);margin-bottom:24px}
	h1{font-family:Georgia,serif;font-size:clamp(64px,8vw,118px);font-weight:400;line-height:.86;letter-spacing:-.055em;margin:0 0 36px}h1 em{font-weight:400;color:var(--sand)}
	.hero-copy{font-family:Georgia,serif;font-size:clamp(25px,3vw,39px);line-height:1.18;max-width:700px;margin:0 0 20px}.hero-sub{font-size:17px;line-height:1.7;color:#e8e6e0;max-width:680px;margin-bottom:32px}
	.cta{display:inline-flex;align-items:center;justify-content:center;border-radius:2px;padding:16px 26px;text-decoration:none;font-weight:700;border:0;font-size:15px}.primary{background:var(--gold);color:var(--navy)}.micro{font-size:12px;color:#c8c9cc;margin-top:17px;letter-spacing:.03em}
	.hero-card{justify-self:center;width:min(340px,100%);aspect-ratio:3/4;background:linear-gradient(145deg,#f7f3e9,#eadfca);color:var(--navy);padding:44px 34px;box-shadow:0 30px 80px rgba(0,0,0,.3);display:flex;flex-direction:column;justify-content:center}.hero-card span{font-size:11px;letter-spacing:.18em}.hero-card strong{font-family:Georgia,serif;font-size:45px;line-height:.98;font-weight:400;margin:22px 0}.hero-card p{font-size:14px}.card-line{height:1px;background:var(--gold);width:55px;margin-bottom:30px}.gold-dot{width:13px;height:13px;border:1px solid var(--gold);border-radius:50%;position:absolute;bottom:30px;right:30px}
	.recognition,.program,.author,.purchase,.safety{padding:100px clamp(24px,7vw,110px)}.recognition{background:var(--cream)}.recognition-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:90px}.recognition h2,.program h2,.inside h2,.result h2,.author h2,.purchase h2{font-family:Georgia,serif;font-weight:400;font-size:clamp(38px,4.5vw,64px);line-height:1.04;margin:0}.lead{font-size:18px;line-height:1.7;max-width:480px;margin-top:28px}.situations{border-top:1px solid rgba(34,52,78,.22)}.situation{display:grid;grid-template-columns:30px 1fr;gap:14px;border-bottom:1px solid rgba(34,52,78,.22);padding:20px 0}.situation span{color:var(--gold)}.situation p{margin:0;line-height:1.55}
	.statement{background:var(--sand);padding:95px clamp(24px,12vw,180px);text-align:center}.statement p{font-size:18px;margin:0 0 20px}.statement h2{font-family:Georgia,serif;font-size:clamp(40px,5vw,72px);font-weight:400;line-height:1.05;margin:0}.statement em{color:#6e5420}
	.program{background:#fff}.program-head{display:grid;grid-template-columns:1.4fr .6fr;gap:50px;align-items:end;margin-bottom:55px}.program-head p{line-height:1.6}.modules{border-top:1px solid #d9d9d4}.modules article{display:grid;grid-template-columns:90px 1fr;gap:20px;padding:28px 0;border-bottom:1px solid #d9d9d4}.module-no{font-family:Georgia,serif;font-size:24px;color:var(--gold)}.modules h3{font-family:Georgia,serif;font-size:26px;font-weight:400;margin:0 0 8px}.modules p{margin:0;color:#526074;line-height:1.6;max-width:780px}
	.inside{background:var(--navy);color:white;padding:100px clamp(24px,7vw,110px)}.section-label.light{color:var(--sand)}.format-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.18);margin-top:60px}.format-grid>div{background:var(--navy);padding:34px}.format-grid b{color:var(--gold);font-family:Georgia,serif;font-size:24px}.format-grid h3{font-family:Georgia,serif;font-weight:400;font-size:24px}.format-grid p{color:#d5d9df;line-height:1.55;font-size:14px}
	.result{padding:90px clamp(24px,10vw,150px);background:var(--cream)}.result-box{max-width:900px;margin:auto;text-align:center}.result-box>p{font-size:18px;line-height:1.7}.quote{font-family:Georgia,serif!important;font-size:28px!important;color:#745817;border-top:1px solid var(--gold);padding-top:32px;margin-top:40px}
	.author{display:grid;grid-template-columns:220px 1fr;gap:60px;background:#fff;align-items:center}.author-mark{width:180px;height:180px;border-radius:50%;background:var(--navy);color:var(--gold);display:grid;place-items:center;font-family:Georgia,serif;font-size:52px}.author p{line-height:1.7;max-width:760px}.note{font-size:13px;color:#657083;border-left:2px solid var(--gold);padding-left:16px;margin-top:24px}
	.purchase{background:var(--navy);color:white;display:grid;grid-template-columns:1fr 360px;gap:70px;align-items:center}.purchase p{color:#d7dce2}.price-card{background:var(--cream);color:var(--navy);padding:36px}.price-card span,.price-card small{display:block}.price-card strong{font-family:Georgia,serif;font-size:58px;font-weight:400;display:block;margin:8px 0 22px}.price-card button{width:100%;cursor:not-allowed;opacity:.72}.price-card small{margin-top:14px;line-height:1.4;color:#687383}
	.safety{background:#eee8dc;padding-top:50px;padding-bottom:50px}.safety h3{font-family:Georgia,serif;font-size:25px;margin:0 0 10px}.safety p{max-width:900px;line-height:1.6;margin:0}
	@media(max-width:850px){.hero{grid-template-columns:1fr;padding-top:70px}.hero-card{width:280px}.recognition-grid,.program-head,.author,.purchase{grid-template-columns:1fr;gap:40px}.format-grid{grid-template-columns:1fr 1fr}.author-mark{width:120px;height:120px;font-size:38px}.purchase{grid-template-columns:1fr}.price-card{max-width:420px}}
	@media(max-width:520px){.hero{min-height:auto;padding:70px 22px}.hero-card{width:245px}.recognition,.program,.inside,.author,.purchase{padding:70px 22px}.format-grid{grid-template-columns:1fr}.modules article{grid-template-columns:52px 1fr}.modules h3{font-size:22px}.statement{padding:70px 22px}}
</style>
