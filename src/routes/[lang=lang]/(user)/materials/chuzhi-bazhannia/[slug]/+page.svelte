<script lang="ts">
	import { Locale } from '$i18n';
	import Seo from '$lib/Seo/Seo.svelte';
	import CollectionPurchase from '$lib/Materials/CollectionPurchase.svelte';
	import { COLLECTIONS, SERIES_PATH, collectionPath } from '$lib/Materials/collections-catalog';
	import { COLLECTIONS_PL, collectionPathPL } from '$lib/Materials/collections-catalog-pl';
	import { absoluteUrl } from '$shared/global/functions/site-url';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const item = $derived(data.collection);
	const path = $derived(collectionPath(item));
	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Product',
				name: item.name,
				description: item.desc,
				image: absoluteUrl(`/assets/collections/${item.id + 1}.webp`),
				sku: `collection-ua-${item.id + 1}`,
				brand: { '@type': 'Brand', name: 'Bezstresowo' },
				offers: { '@type': 'Offer', url: absoluteUrl(path), price: '19.00', priceCurrency: 'PLN' }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Матеріали',
						item: absoluteUrl('/uk/materials')
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Чужі бажання',
						item: absoluteUrl(SERIES_PATH)
					},
					{ '@type': 'ListItem', position: 3, name: item.name, item: absoluteUrl(path) }
				]
			}
		]
	});
</script>

<Seo
	title={`${item.seoTitle} | Bezstresowo`}
	description={`${item.desc} 8 життєвих історій, відповіді та вправи. 19 zł.`}
	noindex={data.noindex}
	alternates={[
		{ locale: Locale.ukUA, path: path.replace('/uk', '') },
		{ locale: Locale.plPL, path: collectionPathPL(COLLECTIONS_PL[item.id]).replace('/pl', '') }
	]}
	image={absoluteUrl(`/assets/collections/${item.id + 1}.webp`)}
	imageAlt={`Обкладинка збірки «${item.name}»`}
	{jsonLd}
/>

<div class="collection-page">
	<div class="shell">
		<nav class="breadcrumbs" aria-label="Навігація">
			<a href="/uk/materials">Матеріали</a><span aria-hidden="true">/</span><a href={SERIES_PATH}
				>Чужі бажання</a
			><span aria-hidden="true">/</span><span>{item.name}</span>
		</nav>
		<section class="product-hero" aria-labelledby="collection-title">
			<div class="art">
				<img
					src={`/assets/collections/${item.id + 1}.webp`}
					alt={`Обкладинка «${item.name}»`}
					fetchpriority="high"
					width="600"
					height="900"
				/>
			</div>
			<div class="hero-copy">
				<p class="eyebrow">ЧУЖІ БАЖАННЯ · ЗБІРКА {String(item.id + 1).padStart(2, '0')}</p>
				<p class="topic">{item.topic}</p>
				<h1 id="collection-title">{item.name}</h1>
				<p class="hook">{item.hook}</p>
				<p class="intro">{item.intro}</p>
				<div class="purchase-box">
					<div class="price">
						<strong>19 <span>zł</span></strong><span
							>20 сторінок · 8 історій<br />відповіді та вправи</span
						>
					</div>
					<CollectionPurchase id={item.id} ready={data.purchaseReady} />
					<p class="delivery">
						Електронна збірка. Після оплати — доступ до файлу й лист із посиланням.
					</p>
				</div>
				<a class="bundle-link" href={`${SERIES_PATH}?plan=three&select=${item.id}#collections`}
					>Обрати три збірки за 49 zł <span aria-hidden="true">→</span></a
				>
			</div>
		</section>

		<section class="about section-rule" aria-labelledby="about-title">
			<div>
				<p class="eyebrow">ПРО ЦЮ ЗБІРКУ</p>
				<h2 id="about-title">Коли знайоме<br />стає зрозумілішим.</h2>
			</div>
			<div>
				<p>{item.body}</p>
				<blockquote>{item.quote}</blockquote>
			</div>
		</section>

		<section class="situations section-rule" aria-labelledby="situations-title">
			<p class="eyebrow">КІЛЬКА СИТУАЦІЙ ІЗ ЗБІРКИ</p>
			<h2 id="situations-title">Можливо, ти це впізнаєш.</h2>
			<div class="scenario-grid">
				{#each item.examples as example, index (example)}<article>
						<span class="scenario-number">{String(index + 1).padStart(2, '0')}</span>
						<h3>{example.title}</h3>
						<p>{example.text}</p>
					</article>{/each}
			</div>
		</section>

		<section class="benefits section-rule" aria-labelledby="benefits-title">
			<div>
				<p class="eyebrow">ДЛЯ ВЛАСНОГО НАСТУПНОГО КРОКУ</p>
				<h2 id="benefits-title">Що ти зможеш<br />розібрати.</h2>
			</div>
			<ul>
				{#each item.benefits as benefit (benefit)}<li>{benefit}</li>{/each}
			</ul>
		</section>

		<section class="inside section-rule" aria-labelledby="inside-title">
			<p class="eyebrow">ЩО ТИ ОТРИМАЄШ</p>
			<h2 id="inside-title">Від історії до власної відповіді.</h2>
			<div class="inside-grid">
				<article>
					<span>01</span>
					<h3>8 життєвих історій</h3>
					<p>
						Конкретні ситуації, пояснення тиску й важливі відмінності, які допомагають точніше
						зрозуміти контекст.
					</p>
				</article>
				<article>
					<span>02</span>
					<h3>Слова та дії</h3>
					<p>Варіанти відповідей і наступного кроку, які можна адаптувати до своїх обставин.</p>
				</article>
				<article>
					<span>03</span>
					<h3>Вправи для себе</h3>
					<p>
						Окреме завдання після кожної історії та місце для записів. Можна працювати з однією
						ситуацією у власному темпі.
					</p>
				</article>
			</div>
		</section>

		<section class="author section-rule">
			<div>
				<p class="eyebrow">АВТОР</p>
				<h2>Олеся Гайдук</h2>
				<p class="profession">Психолог, психотерапевт</p>
			</div>
			<div>
				<p>
					Це психоосвітня збірка для самостійного читання й осмислення власного досвіду. Вона не є
					діагностикою та не замінює психотерапію.
				</p>
				<p>
					Якщо ситуація небезпечна, пріоритет — твоя безпека й доступна підтримка. Запропоновані
					фрази не зобов’язують вступати в конфлікт.
				</p>
			</div>
		</section>

		<section class="closing">
			<div>
				<p class="eyebrow">ПОЧНИ З ОДНІЄЇ БЛИЗЬКОЇ ТЕМИ</p>
				<h2>{item.name}</h2>
				<p>{item.hook}</p>
			</div>
			<div class="closing-buy">
				<p class="closing-price">19 zł</p>
				<CollectionPurchase id={item.id} ready={data.purchaseReady} /><a
					href={`${SERIES_PATH}?plan=all#collections`}>Уся серія: 8 збірок за 99 zł →</a
				>
			</div>
		</section>

		<section class="related section-rule" aria-labelledby="related-title">
			<p class="eyebrow">ІНШІ ТЕМИ СЕРІЇ</p>
			<h2 id="related-title">Якщо відгукується ще щось.</h2>
			<div class="related-grid">
				{#each item.related as id (id)}{@const other = COLLECTIONS[id]}<a
						class="related-card"
						href={collectionPath(other)}
						><img
							src={`/assets/collections/${id + 1}.webp`}
							alt={`Обкладинка «${other.name}»`}
							loading="lazy"
							width="160"
							height="240"
						/>
						<div>
							<h3>{other.name}</h3>
							<p>{other.hook}</p>
							<span>Детальніше про збірку →</span>
						</div></a
					>{/each}
			</div>
			<a class="back-link" href={`${SERIES_PATH}#collections`}>Переглянути всі вісім збірок →</a>
		</section>
	</div>
</div>

<style>
	.collection-page {
		background: #f3f0e7;
		color: #22344e;
		font:
			16px/1.65 Arial,
			sans-serif;
		padding: 0 24px;
	}
	.collection-page :global(*) {
		box-sizing: border-box;
	}
	.shell {
		max-width: 1120px;
		margin: auto;
	}
	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		font-size: 12px;
		padding: 25px 0 0;
		color: #5c6877;
	}
	.breadcrumbs a {
		text-decoration: none;
	}
	.breadcrumbs a:hover {
		text-decoration: underline;
	}
	.product-hero {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		gap: 80px;
		align-items: center;
		padding: 55px 0 75px;
	}
	.art {
		padding: 25px 30px;
		background: radial-gradient(ellipse, #e5dfd0 0%, transparent 70%);
	}
	.art img {
		display: block;
		width: 100%;
		height: auto;
		max-width: 330px;
		margin: auto;
		box-shadow: 0 22px 40px #22344e28;
		transform: rotate(-2deg);
	}
	.eyebrow {
		font-size: 10px;
		letter-spacing: 1.7px;
		font-weight: 700;
		margin: 0 0 14px;
	}
	.topic {
		font-size: 13px;
		color: #647080;
		margin: 0 0 14px;
	}
	.collection-page h1,
	.collection-page h2,
	.collection-page h3 {
		font-family: Georgia, serif;
		font-weight: 400;
	}
	.collection-page h1 {
		font-size: clamp(36px, 4.3vw, 56px);
		line-height: 1.12;
		margin: 0 0 23px;
		text-wrap: balance;
	}
	.hook {
		font-size: 21px;
		line-height: 1.45;
		margin: 0 0 18px;
	}
	.intro {
		color: #4d5b6c;
		margin: 0 0 27px;
		font-size: 16px;
	}
	.purchase-box {
		border-top: 1px solid #22344e26;
		padding-top: 20px;
	}
	.price {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-bottom: 16px;
	}
	.price strong {
		font-family: Georgia, serif;
		font-size: 43px;
		font-weight: 400;
		line-height: 1;
	}
	.price strong span {
		font-size: 25px;
	}
	.price > span {
		font-size: 12px;
		line-height: 1.6;
		text-align: right;
		color: #5c6877;
	}
	.delivery {
		font-size: 11px;
		line-height: 1.6;
		margin: 12px 0 0;
		color: #5c6877;
	}
	.bundle-link {
		display: inline-block;
		margin-top: 17px;
		color: #22344e;
		font-size: 13px;
		text-underline-offset: 4px;
	}
	.section-rule {
		border-top: 1px solid #22344e26;
		padding: 65px 0;
	}
	.collection-page h2 {
		font-size: clamp(29px, 3vw, 40px);
		line-height: 1.2;
		margin: 0 0 24px;
	}
	.about,
	.benefits,
	.author {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 65px;
	}
	.about p,
	.author p {
		margin-top: 0;
		color: #4d5b6c;
	}
	.about blockquote {
		margin: 25px 0 0;
		padding: 22px 25px;
		border-left: 3px solid #e5ae31;
		background: #fdd89666;
		font-family: Georgia, serif;
		font-size: 23px;
		line-height: 1.4;
	}
	.scenario-grid,
	.inside-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	.scenario-grid article {
		background: #fffdf7;
		border: 1px solid #22344e16;
		border-radius: 6px;
		padding: 28px;
	}
	.scenario-number {
		color: #a57418;
		font-size: 12px;
		letter-spacing: 1px;
	}
	.collection-page h3 {
		font-size: 23px;
		line-height: 1.3;
		margin: 16px 0;
	}
	.scenario-grid p,
	.inside-grid p {
		font-size: 14px;
		color: #4d5b6c;
		margin: 0;
	}
	.benefits ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.benefits li {
		padding: 18px 0 18px 27px;
		border-bottom: 1px solid #22344e20;
		position: relative;
	}
	.benefits li:first-child {
		padding-top: 0;
	}
	.benefits li:before {
		content: '—';
		position: absolute;
		left: 0;
		color: #a57418;
	}
	.inside-grid article {
		padding: 20px 24px 10px 0;
		border-right: 1px solid #22344e20;
	}
	.inside-grid article:last-child {
		border: 0;
	}
	.inside-grid article > span {
		font:
			24px Georgia,
			serif;
		color: #a57418;
	}
	.author {
		font-size: 14px;
	}
	.author .profession {
		color: #22344e;
	}
	.closing {
		background: #22344e;
		color: #f3f0e7;
		border-radius: 7px;
		padding: 40px;
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 65px;
		align-items: center;
		margin: 0 0 65px;
	}
	.closing h2 {
		margin-bottom: 15px;
	}
	.closing p:last-child {
		margin-bottom: 0;
	}
	.closing-buy :global(.collection-buy) {
		background: #e5ae31;
		color: #22344e;
	}
	.closing-buy :global(.collection-buy:hover) {
		background: #fdd896;
	}
	.closing-buy :global(.purchase-message) {
		color: #f3f0e7;
	}
	.closing-price {
		font:
			32px Georgia,
			serif;
		margin: 0 0 15px;
	}
	.closing-buy > a {
		display: block;
		font-size: 12px;
		color: #f3f0e7;
		margin-top: 14px;
		text-underline-offset: 4px;
	}
	.related-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 25px;
	}
	.related-card {
		display: flex;
		gap: 24px;
		align-items: center;
		text-decoration: none;
		padding: 24px;
		background: #fffdf7;
		border-radius: 5px;
	}
	.related-card img {
		width: 90px;
		height: 135px;
		object-fit: cover;
		box-shadow: 0 5px 15px #22344e15;
	}
	.related-card h3 {
		margin-top: 0;
		font-size: 24px;
	}
	.related-card p {
		font-size: 13px;
		color: #5c6877;
		margin: 0 0 15px;
	}
	.related-card span,
	.back-link {
		font-size: 12px;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.back-link {
		display: inline-block;
		margin-top: 28px;
		color: #22344e;
	}
	.collection-page a:focus-visible {
		outline: 3px solid #e5ae31;
		outline-offset: 4px;
	}
	@media (max-width: 850px) {
		.product-hero {
			gap: 35px;
		}
		.art {
			padding: 10px;
		}
		.about,
		.benefits,
		.author {
			gap: 30px;
		}
		.scenario-grid {
			gap: 14px;
		}
		.scenario-grid article {
			padding: 20px;
		}
		.related-card {
			gap: 16px;
			padding: 18px;
		}
		.closing {
			gap: 30px;
		}
	}
	@media (max-width: 600px) {
		.collection-page {
			padding: 0 20px;
		}
		.breadcrumbs {
			font-size: 11px;
			gap: 7px;
		}
		.product-hero {
			grid-template-columns: 1fr;
			gap: 35px;
			padding: 35px 0 45px;
		}
		.art {
			padding: 10px;
			max-width: 260px;
			justify-self: center;
		}
		.art img {
			max-width: 220px;
		}
		.collection-page h1 {
			font-size: 38px;
		}
		.hook {
			font-size: 19px;
		}
		.intro {
			font-size: 15px;
		}
		.about,
		.benefits,
		.author {
			grid-template-columns: 1fr;
			gap: 15px;
		}
		.section-rule {
			padding: 40px 0;
		}
		.collection-page h2 {
			font-size: 30px;
		}
		.about blockquote {
			font-size: 21px;
			padding: 20px;
		}
		.scenario-grid,
		.inside-grid,
		.related-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		.scenario-grid article {
			padding: 24px;
		}
		.inside-grid article {
			padding: 12px 0 24px;
			border-right: 0;
			border-bottom: 1px solid #22344e20;
		}
		.closing {
			grid-template-columns: 1fr;
			gap: 20px;
			padding: 27px;
			margin-bottom: 40px;
		}
		.related-card img {
			width: 80px;
			height: 120px;
		}
		.related-card h3 {
			font-size: 22px;
		}
		.price > span {
			font-size: 11px;
		}
	}
</style>
