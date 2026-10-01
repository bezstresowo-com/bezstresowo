<script lang="ts">
	import { Locale } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';

	import { PROGRAM_LANDING_COPY } from './copy';

	const copy = PROGRAM_LANDING_COPY;
</script>

<Seo
	title={copy.seo.title}
	description={copy.seo.description}
	noindex
	alternates={[{ locale: Locale.plPL, path: '/kryzys-czy-koniec' }]}
/>

<div class="landing">
	<section class="hero">
		<div class="hero-glow"></div>
		<div class="hero-inner">
			<div class="eyebrow">{copy.hero.eyebrow}</div>
			<h1>{copy.hero.titleFirst}<br /><em>{copy.hero.titleSecond}</em></h1>
			<p class="hero-copy">{copy.hero.lead}</p>
			<p class="hero-sub">{copy.hero.description}</p>
			<a class="cta primary" href="#program">{copy.hero.cta}</a>
			<p class="micro">{copy.hero.meta}</p>
		</div>

		<div class="workbook-preview">
			<img
				src="/assets/kryzys-czy-koniec-workbook-cover.webp"
				alt="Okładka zeszytu ćwiczeń „Kryzys czy koniec?”"
				width="909"
				height="1287"
			/>
		</div>
	</section>

	<section class="recognition">
		<div class="section-label">{copy.recognition.eyebrow}</div>
		<div class="recognition-grid">
			<div>
				<h2>{copy.recognition.title}</h2>
				<p class="lead">{copy.recognition.lead}</p>
			</div>
			<div class="situations">
				{#each copy.recognition.situations as item (item)}
					<div class="situation">
						<span>✦</span>
						<p>{item}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="statement">
		<h2>{copy.statement.title}</h2>
		<p>{copy.statement.description}</p>
	</section>

	<section class="benefits" aria-labelledby="benefits-title">
		<div class="section-label">{copy.benefits.eyebrow}</div>
		<h2 id="benefits-title">{copy.benefits.title}</h2>
		<p class="benefits-intro">{copy.benefits.intro}</p>
		<div class="benefits-grid">
			{#each copy.benefits.items as item, index (item.title)}
				<article>
					<span>0{index + 1}</span>
					<h3>{item.title}</h3>
					<p>{item.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="program" id="program">
		<div class="section-label">{copy.program.eyebrow}</div>
		<div class="program-head">
			<h2>{copy.program.title}</h2>
		</div>
		<div class="modules">
			{#each copy.program.modules as module (module.number)}
				<article>
					<div class="module-no">{module.number}</div>
					<div>
						<h3>{module.title}</h3>
						<p>{module.description}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="inside">
		<div>
			<div class="section-label light">{copy.format.eyebrow}</div>
			<h2>{copy.format.title}</h2>
		</div>
		<div class="format-grid">
			{#each copy.format.items as item (item.number)}
				<div>
					<b>{item.number}</b>
					<h3>{item.title}</h3>
					<p>{item.description}</p>
					<ul>
						{#each item.benefits as benefit (benefit)}
							<li>{benefit}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<section class="result">
		<div class="result-box">
			<div class="section-label">{copy.result.eyebrow}</div>
			<h2>{copy.result.title}</h2>
			<p>{copy.result.description}</p>
			<p class="quote">{copy.result.quote}</p>
		</div>
	</section>

	<section class="faq" aria-labelledby="faq-title">
		<div class="section-label">{copy.faq.eyebrow}</div>
		<h2 id="faq-title">{copy.faq.title}</h2>
		<div class="faq-list">
			{#each copy.faq.items as item (item.question)}
				<details>
					<summary>{item.question}</summary>
					<p>{item.answer}</p>
				</details>
			{/each}
		</div>
	</section>

	<section class="author">
		<img
			class="author-photo"
			src="/assets/about-me.jpg"
			alt="Olesya Haiduk"
			width="528"
			height="500"
			loading="lazy"
		/>
		<div>
			<div class="section-label">{copy.author.eyebrow}</div>
			<h2>{copy.author.name}</h2>
			<p>{copy.author.description}</p>
			<p class="note">{copy.author.note}</p>
		</div>
	</section>

	<section class="purchase" id="purchase">
		<div>
			<div class="section-label light">{copy.purchase.eyebrow}</div>
			<h2>{copy.purchase.title}</h2>
			<p>{copy.purchase.description}</p>
		</div>
		<div class="price-card">
			<span>{copy.purchase.priceLabel}</span>
			<strong>{copy.purchase.price}</strong>
			<a
				class="cta primary"
				href="#purchase"
				aria-disabled="true"
				onclick={(event) => event.preventDefault()}>Wkrótce dostępny</a
			>
			<small>{copy.purchase.note}</small>
		</div>
	</section>

	<section class="safety">
		<h3>{copy.safety.title}</h3>
		<p>{copy.safety.description}</p>
	</section>
</div>

<style>
	:global(body) {
		background: #f3f0e7;
	}

	.landing {
		--navy: #22344e;
		--gold: #e5ae31;
		--sand: #fdd896;
		--cream: #f3f0e7;
		color: var(--navy);
		font-family: inherit;
		overflow: hidden;
	}

	.hero {
		position: relative;
		display: grid;
		min-height: 720px;
		grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.65fr);
		align-items: center;
		gap: 70px;
		padding: 90px clamp(24px, 7vw, 110px);
		background: var(--navy);
		color: white;
	}

	.hero-glow {
		position: absolute;
		top: -180px;
		right: -100px;
		width: 560px;
		height: 560px;
		border-radius: 50%;
		background: radial-gradient(circle, rgb(229 174 49 / 22%), transparent 68%);
	}

	.hero-inner,
	.workbook-preview {
		justify-self: center;
	}

	.hero-inner {
		width: min(650px, 100%);
	}

	.workbook-preview {
		width: min(360px, 100%);
		box-shadow: 0 30px 80px rgb(0 0 0 / 30%);
	}

	.eyebrow,
	.section-label {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.14em;
		line-height: 1.45;
	}

	.section-label {
		margin-bottom: 24px;
		color: #a5791e;
	}

	.hero h1 {
		margin: 20px 0 28px;
		font-family: Georgia, serif;
		font-size: clamp(58px, 6vw, 94px);
		font-weight: 400;
		line-height: 0.98;
	}

	.hero h1 em {
		color: var(--sand);
		font-weight: 400;
	}

	.hero-copy {
		max-width: 590px;
		margin: 0 0 18px;
		font-size: clamp(23px, 2.3vw, 32px);
		line-height: 1.3;
	}

	.hero-sub {
		max-width: 570px;
		margin: 0 0 32px;
		color: #e0e4e9;
		font-size: 18px;
		line-height: 1.6;
	}

	.cta.primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 52px;
		border: 0;
		border-radius: 4px;
		padding: 13px 24px;
		background: var(--gold);
		color: var(--navy);
		font-size: 16px;
		font-weight: 700;
		text-decoration: none;
	}

	.micro {
		margin: 22px 0 0;
		color: #cbd3dd;
		font-size: 14px;
	}

	.workbook-preview img {
		display: block;
		width: 100%;
		height: auto;
	}

	.recognition,
	.benefits,
	.program,
	.faq,
	.author,
	.purchase,
	.safety {
		padding: 100px clamp(24px, 7vw, 110px);
	}

	.faq {
		background: #fff;
	}
	.faq h2 {
		margin: 0 0 36px;
		font-family: Georgia, serif;
		font-size: clamp(38px, 4.5vw, 64px);
		font-weight: 400;
	}
	.faq-list {
		max-width: 900px;
		border-top: 1px solid rgb(34 52 78 / 22%);
	}
	.faq details {
		border-bottom: 1px solid rgb(34 52 78 / 22%);
		padding: 20px 0;
	}
	.faq summary {
		cursor: pointer;
		font-size: 19px;
		font-weight: 600;
	}
	.faq details p {
		max-width: 740px;
		margin: 14px 0 0;
		line-height: 1.7;
	}

	.recognition {
		background: var(--cream);
	}

	.recognition-grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 90px;
	}

	.recognition h2 {
		max-width: 620px;
		font-size: clamp(40px, 4.3vw, 64px);
		line-height: 1.14;
	}

	.recognition h2,
	.program h2,
	.inside h2,
	.result h2,
	.author h2,
	.purchase h2 {
		margin: 0;
		font-family: Georgia, serif;
		font-size: clamp(38px, 4.5vw, 64px);
		font-weight: 400;
		line-height: 1.04;
	}

	.lead {
		max-width: 480px;
		margin-top: 28px;
		font-size: 18px;
		line-height: 1.7;
	}

	.situations {
		border-top: 1px solid rgb(34 52 78 / 22%);
	}

	.situation {
		display: grid;
		grid-template-columns: 30px 1fr;
		gap: 14px;
		border-bottom: 1px solid rgb(34 52 78 / 22%);
		padding: 20px 0;
	}

	.situation span {
		color: var(--gold);
	}

	.situation p {
		margin: 0;
		line-height: 1.55;
	}

	.statement {
		padding: 76px clamp(24px, 4vw, 64px);
		background: var(--sand);
		text-align: center;
	}

	.statement p {
		max-width: 680px;
		margin: 22px auto 0;
		font-size: 18px;
		line-height: 1.6;
	}

	.statement h2 {
		max-width: none;
		margin: 0 auto;
		font-family: Georgia, serif;
		font-size: clamp(34px, 3vw, 42px);
		font-weight: 400;
		line-height: 1.05;
		white-space: normal;
	}

	@media (min-width: 1320px) {
		.statement h2 {
			white-space: nowrap;
		}
	}

	.benefits {
		background: var(--cream);
	}

	.benefits h2 {
		max-width: 820px;
		margin: 0;
		font-family: Georgia, serif;
		font-size: clamp(38px, 4.5vw, 60px);
		font-weight: 400;
		line-height: 1.08;
	}

	.benefits-intro {
		max-width: 760px;
		margin: 25px 0 48px;
		font-size: 18px;
		line-height: 1.65;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}

	.benefits-grid article {
		border-top: 2px solid var(--gold);
		padding: 26px 0 0;
	}

	.benefits-grid span {
		color: #8a681e;
		font-family: Georgia, serif;
		font-size: 22px;
	}

	.benefits-grid h3 {
		min-height: 2.4em;
		margin: 18px 0 12px;
		font-family: Georgia, serif;
		font-size: 28px;
		font-weight: 400;
		line-height: 1.2;
	}

	.benefits-grid p {
		max-width: 370px;
		margin: 0;
		line-height: 1.65;
	}

	.program {
		background: #fff;
	}

	.program-head {
		display: grid;
		grid-template-columns: 1fr;
		align-items: end;
		gap: 50px;
		margin-bottom: 55px;
	}

	.modules {
		border-top: 1px solid #d9d9d4;
	}

	.modules article {
		display: grid;
		grid-template-columns: 90px 1fr;
		gap: 20px;
		border-bottom: 1px solid #d9d9d4;
		padding: 28px 0;
	}

	.module-no {
		color: var(--gold);
		font-family: Georgia, serif;
		font-size: 24px;
	}

	.modules h3 {
		margin: 0 0 8px;
		font-family: Georgia, serif;
		font-size: 26px;
		font-weight: 400;
	}

	.modules p {
		max-width: 780px;
		margin: 0;
		color: #526074;
		line-height: 1.6;
	}

	.inside {
		padding: 100px clamp(24px, 7vw, 110px);
		background: var(--navy);
		color: white;
	}

	.section-label.light {
		color: var(--sand);
	}

	.inside h2 {
		font-size: clamp(32px, 3.6vw, 48px);
	}

	.format-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1px;
		margin-top: 60px;
		background: rgb(255 255 255 / 18%);
	}

	.format-grid > div {
		padding: 36px;
		background: var(--navy);
	}

	.format-grid b {
		color: var(--gold);
		font-family: Georgia, serif;
		font-size: 24px;
	}

	.format-grid h3 {
		font-family: Georgia, serif;
		font-size: 24px;
		font-weight: 400;
	}

	.format-grid p {
		color: white;
		font-size: 17px;
		line-height: 1.55;
	}

	.format-grid ul {
		margin: 22px 0 0;
		padding: 0;
		list-style: none;
	}

	.format-grid li {
		position: relative;
		border-top: 1px solid rgb(255 255 255 / 15%);
		padding: 12px 0 12px 23px;
		color: #d5d9df;
		font-size: 15px;
		line-height: 1.45;
	}

	.format-grid li::before {
		position: absolute;
		left: 0;
		color: var(--gold);
		content: '✦';
	}

	.result {
		padding: 90px clamp(24px, 10vw, 150px);
		background: var(--cream);
	}

	.result-box {
		max-width: 1080px;
		margin: auto;
		text-align: center;
	}

	.result h2 {
		margin-bottom: 28px;
		font-size: clamp(36px, 4vw, 54px);
	}

	.result-box > p {
		max-width: 850px;
		margin-top: 0;
		margin-right: auto;
		margin-left: auto;
		font-size: 18px;
		line-height: 1.7;
	}

	.result-box > .quote {
		max-width: 850px;
		margin-top: 40px;
		border-top: 1px solid var(--gold);
		padding-top: 32px;
		color: #745817;
		font-family: Georgia, serif !important;
		font-size: clamp(22px, 2.5vw, 30px) !important;
		line-height: 1.4 !important;
	}

	.author {
		display: grid;
		grid-template-columns: 220px 1fr;
		align-items: center;
		gap: 60px;
		background: #fff;
	}

	.author-photo {
		display: block;
		width: 180px;
		height: 180px;
		border-radius: 8px;
		object-fit: cover;
	}

	.author p {
		max-width: 760px;
		line-height: 1.7;
	}

	.note {
		margin-top: 24px;
		border-left: 2px solid var(--gold);
		padding-left: 16px;
		color: #657083;
		font-size: 13px;
	}

	.purchase {
		display: grid;
		grid-template-columns: 1fr 360px;
		align-items: center;
		gap: 70px;
		background: var(--navy);
		color: white;
	}

	.purchase p {
		color: #d7dce2;
	}

	.price-card {
		padding: 36px;
		background: var(--cream);
		color: var(--navy);
	}

	.price-card span,
	.price-card small {
		display: block;
	}

	.price-card strong {
		display: block;
		margin: 8px 0 22px;
		font-family: Georgia, serif;
		font-size: 58px;
		font-weight: 400;
	}

	.price-card .cta {
		width: 100%;
		cursor: pointer;
	}

	.price-card small {
		margin-top: 14px;
		color: #687383;
		line-height: 1.4;
	}

	.safety {
		padding-top: 50px;
		padding-bottom: 50px;
		background: #eee8dc;
	}

	.safety h3 {
		margin: 0 0 10px;
		font-family: Georgia, serif;
		font-size: 25px;
	}

	.safety p {
		max-width: 900px;
		margin: 0;
		line-height: 1.6;
	}

	@media (max-width: 850px) {
		.statement h2 {
			white-space: normal;
		}
		.hero {
			grid-template-columns: 1fr;
			padding-top: 70px;
		}

		.workbook-preview {
			width: 280px;
		}

		.recognition-grid,
		.program-head,
		.author,
		.purchase {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.format-grid {
			grid-template-columns: 1fr 1fr;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.benefits-grid h3 {
			min-height: 0;
		}

		.author-photo {
			width: 120px;
			height: 120px;
		}

		.price-card {
			max-width: 420px;
		}
	}

	@media (max-width: 520px) {
		.hero {
			min-height: auto;
			padding: 70px 22px;
		}

		.hero h1 {
			font-size: clamp(52px, 13vw, 70px);
		}

		.workbook-preview {
			width: 245px;
		}

		.recognition,
		.benefits,
		.program,
		.inside,
		.author,
		.purchase {
			padding: 70px 22px;
		}

		.format-grid {
			grid-template-columns: 1fr;
		}

		.modules article {
			grid-template-columns: 52px 1fr;
		}

		.modules h3 {
			font-size: 22px;
		}

		.statement {
			padding: 70px 22px;
		}
	}
</style>
