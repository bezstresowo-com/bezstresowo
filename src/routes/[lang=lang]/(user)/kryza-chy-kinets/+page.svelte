<script lang="ts">
	import { Locale } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';
	import { trackMetaCustomEvent } from '$lib/Tracking/meta-events';
	import { RELATIONSHIP_GUIDE_URLS } from '$shared/global/config/guide';

	import { PROGRAM_LANDING_COPY } from './copy';

	const copy = PROGRAM_LANDING_COPY;
	const guideUrl = RELATIONSHIP_GUIDE_URLS[Locale.ukUA];
</script>

<Seo
	title={copy.seo.title}
	description={copy.seo.description}
	noindex
	alternates={[{ locale: Locale.ukUA, path: '/kryza-chy-kinets' }]}
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

		<div class="hero-card" aria-hidden="true">
			<div class="card-line"></div>
			<span>{copy.hero.workbookLabel}</span>
			<strong>{copy.hero.titleFirst}<br />{copy.hero.titleSecond}</strong>
			<p>{copy.hero.workbookSubtitle}</p>
			<div class="gold-dot"></div>
		</div>
	</section>

	<section class="guide-bridge" aria-labelledby="guide-bridge-title">
		<div class="section-label" id="guide-bridge-title">{copy.guideBridge.eyebrow}</div>
		<div class="bridge-grid">
			<article class="bridge-stage guide-stage">
				<div class="stage-number">17</div>
				<div>
					<p class="stage-label">{copy.guideBridge.guideLabel}</p>
					<h2>{copy.guideBridge.guideTitle}</h2>
					<p>{copy.guideBridge.guideDescription}</p>
				</div>
			</article>

			<div class="bridge-arrow" aria-hidden="true">
				<span></span>
				<i class="fa-solid fa-arrow-right"></i>
			</div>

			<article class="bridge-stage program-stage">
				<div class="stage-number">7</div>
				<div>
					<p class="stage-label">{copy.guideBridge.programLabel}</p>
					<h2>{copy.guideBridge.programTitle}</h2>
					<p>{copy.guideBridge.programDescription}</p>
				</div>
			</article>
		</div>

		<a class="guide-link" href={guideUrl} onclick={() => trackMetaCustomEvent('FreeMaterialOpen')}>
			{copy.guideBridge.guideCta}
			<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
		</a>
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
		<p>{copy.statement.intro} <em>{copy.statement.emphasis}</em></p>
		<h2>{copy.statement.title}</h2>
	</section>

	<section class="program" id="program">
		<div class="section-label">{copy.program.eyebrow}</div>
		<div class="program-head">
			<h2>{copy.program.title}</h2>
			<p>{copy.program.description}</p>
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

	<section class="author">
		<div class="author-mark" aria-hidden="true">OH</div>
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
			<button class="cta primary" type="button" disabled>{copy.purchase.button}</button>
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
	.hero-card {
		position: relative;
		z-index: 1;
	}

	.eyebrow,
	.section-label {
		margin-bottom: 24px;
		color: var(--gold);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.18em;
	}

	h1 {
		margin: 0 0 36px;
		font-family: Georgia, serif;
		font-size: clamp(64px, 8vw, 118px);
		font-weight: 400;
		line-height: 0.86;
		letter-spacing: -0.055em;
	}

	h1 em {
		color: var(--sand);
		font-weight: 400;
	}

	.hero-copy {
		max-width: 700px;
		margin: 0 0 20px;
		font-family: Georgia, serif;
		font-size: clamp(25px, 3vw, 39px);
		line-height: 1.18;
	}

	.hero-sub {
		max-width: 680px;
		margin-bottom: 32px;
		color: #e8e6e0;
		font-size: 17px;
		line-height: 1.7;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 2px;
		padding: 16px 26px;
		font-size: 15px;
		font-weight: 700;
		text-decoration: none;
	}

	.primary {
		background: var(--gold);
		color: var(--navy);
	}

	.micro {
		margin-top: 17px;
		color: #c8c9cc;
		font-size: 12px;
		letter-spacing: 0.03em;
	}

	.hero-card {
		display: flex;
		width: min(340px, 100%);
		aspect-ratio: 3 / 4;
		flex-direction: column;
		justify-content: center;
		justify-self: center;
		padding: 44px 34px;
		background: linear-gradient(145deg, #f7f3e9, #eadfca);
		box-shadow: 0 30px 80px rgb(0 0 0 / 30%);
		color: var(--navy);
	}

	.hero-card span {
		font-size: 11px;
		letter-spacing: 0.18em;
	}

	.hero-card strong {
		margin: 22px 0;
		font-family: Georgia, serif;
		font-size: 45px;
		font-weight: 400;
		line-height: 0.98;
	}

	.hero-card p {
		font-size: 14px;
	}

	.card-line {
		width: 55px;
		height: 1px;
		margin-bottom: 30px;
		background: var(--gold);
	}

	.gold-dot {
		position: absolute;
		right: 30px;
		bottom: 30px;
		width: 13px;
		height: 13px;
		border: 1px solid var(--gold);
		border-radius: 50%;
	}

	.guide-bridge {
		padding: 72px clamp(24px, 7vw, 110px);
		background: #fff;
	}

	.bridge-grid {
		display: grid;
		grid-template-columns: 1fr 82px 1fr;
		align-items: stretch;
	}

	.bridge-stage {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 22px;
		padding: 28px;
		border: 1px solid rgb(34 52 78 / 16%);
		border-radius: 18px;
	}

	.guide-stage {
		background: var(--cream);
	}

	.program-stage {
		border-color: rgb(229 174 49 / 55%);
		background: var(--navy);
		color: white;
	}

	.stage-number {
		color: var(--gold);
		font-family: Georgia, serif;
		font-size: 45px;
		line-height: 1;
	}

	.stage-label {
		margin: 0 0 10px;
		color: #7b5d17;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
	}

	.program-stage .stage-label {
		color: var(--sand);
	}

	.bridge-stage h2 {
		margin: 0 0 10px;
		font-family: Georgia, serif;
		font-size: clamp(25px, 2.4vw, 34px);
		font-weight: 400;
		line-height: 1.08;
	}

	.bridge-stage p:last-child {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
	}

	.program-stage p:last-child {
		color: #d7dce2;
	}

	.bridge-arrow {
		display: flex;
		align-items: center;
		color: var(--gold);
	}

	.bridge-arrow span {
		width: 100%;
		height: 1px;
		background: var(--gold);
	}

	.bridge-arrow i {
		margin-left: -1px;
	}

	.guide-link {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		margin-top: 22px;
		color: var(--navy);
		font-size: 14px;
		font-weight: 700;
		text-decoration-color: var(--gold);
		text-underline-offset: 4px;
	}

	.recognition,
	.program,
	.author,
	.purchase,
	.safety {
		padding: 100px clamp(24px, 7vw, 110px);
	}

	.recognition {
		background: var(--cream);
	}

	.recognition-grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 90px;
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
		padding: 95px clamp(24px, 12vw, 180px);
		background: var(--sand);
		text-align: center;
	}

	.statement p {
		margin: 0 0 20px;
		font-size: 18px;
	}

	.statement h2 {
		margin: 0;
		font-family: Georgia, serif;
		font-size: clamp(40px, 5vw, 72px);
		font-weight: 400;
		line-height: 1.05;
	}

	.statement em {
		color: #6e5420;
	}

	.program {
		background: #fff;
	}

	.program-head {
		display: grid;
		grid-template-columns: 1.4fr 0.6fr;
		align-items: end;
		gap: 50px;
		margin-bottom: 55px;
	}

	.program-head p {
		line-height: 1.6;
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

	.format-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		margin-top: 60px;
		background: rgb(255 255 255 / 18%);
	}

	.format-grid > div {
		padding: 34px;
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
		color: #d5d9df;
		font-size: 14px;
		line-height: 1.55;
	}

	.result {
		padding: 90px clamp(24px, 10vw, 150px);
		background: var(--cream);
	}

	.result-box {
		max-width: 900px;
		margin: auto;
		text-align: center;
	}

	.result-box > p {
		font-size: 18px;
		line-height: 1.7;
	}

	.quote {
		margin-top: 40px;
		border-top: 1px solid var(--gold);
		padding-top: 32px;
		color: #745817;
		font-family: Georgia, serif !important;
		font-size: 28px !important;
	}

	.author {
		display: grid;
		grid-template-columns: 220px 1fr;
		align-items: center;
		gap: 60px;
		background: #fff;
	}

	.author-mark {
		display: grid;
		width: 180px;
		height: 180px;
		place-items: center;
		border-radius: 50%;
		background: var(--navy);
		color: var(--gold);
		font-family: Georgia, serif;
		font-size: 52px;
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

	.price-card button {
		width: 100%;
		cursor: not-allowed;
		opacity: 0.72;
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
		.hero {
			grid-template-columns: 1fr;
			padding-top: 70px;
		}

		.hero-card {
			width: 280px;
		}

		.bridge-grid {
			grid-template-columns: 1fr;
			gap: 0;
		}

		.bridge-arrow {
			width: 44px;
			height: 54px;
			flex-direction: column;
			justify-self: center;
		}

		.bridge-arrow span {
			width: 1px;
			height: 100%;
		}

		.bridge-arrow i {
			margin-top: -2px;
			margin-left: 0;
			transform: rotate(90deg);
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

		.author-mark {
			width: 120px;
			height: 120px;
			font-size: 38px;
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

		.hero-card {
			width: 245px;
		}

		.guide-bridge,
		.recognition,
		.program,
		.inside,
		.author,
		.purchase {
			padding: 70px 22px;
		}

		.bridge-stage {
			grid-template-columns: 1fr;
			padding: 24px;
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
