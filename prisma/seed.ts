/**
 * Seeds the database with the content of the legacy production site
 * (https://bezstresowo.org):
 *
 *  1. Blog articles - a snapshot of the legacy `GET /api/blog` taken on
 *     17.08.2026, stored in `prisma/seed-data/blog-articles.json`. That
 *     endpoint ships with the legacy site and disappears with the first
 *     deploy of this branch, so the data is baked into the repo instead of
 *     being fetched at seed time. The legacy articles are polish; the
 *     ukrainian versions were translated for this seed and live in the same
 *     snapshot - each article becomes a `BlogArticle` with a `pl-PL` and a
 *     `uk-UA` translation.
 *  2. Products - the live Stripe catalog of the legacy site (verified against
 *     `GET /api/stripe/price-list` on 17.08.2026) with polish and ukrainian
 *     translations. The app now owns products and prices in the database;
 *     Stripe only ever opens checkout sessions.
 *
 *   npm run prisma:seed             # writes to DATABASE_URL from .env
 *   npm run prisma:seed -- --dry-run
 *
 * Runs through `tsx` - the generated prisma client is typescript with
 * extensionless imports, which plain `node` cannot resolve. Safe to re-run:
 * existing slugs are skipped, and language versions missing from an already
 * seeded article are attached to it.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { PrismaClient } from '../src/shared/server/generated/prisma/client.js';

const DRY_RUN = process.argv.includes('--dry-run');
const META_TITLE_MAX_LENGTH = 60;
const META_DESCRIPTION_MAX_LENGTH = 155;
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://bezstresowo.org').replace(/\/+$/, '');

const PRODUCT_CURRENCY = 'PLN';

/** `<html lang>` tag per supported locale, mirrors `LOCALE_HTML_LANG`. */
const HTML_LANG: Record<string, string> = { 'pl-PL': 'pl', 'uk-UA': 'uk' };

type SeedArticleTranslation = {
	title: string;
	content: string;
};

type SeedArticle = {
	/** One english slug shared by every language version. */
	slug: string;
	createdAt: string;
	updatedAt: string;
	/** Keyed by locale (`pl-PL` / `uk-UA`). */
	translations: Record<string, SeedArticleTranslation>;
};

/** Snapshot of the legacy site's blog - see the header comment. */
const ARTICLES: SeedArticle[] = JSON.parse(
	readFileSync(path.join(import.meta.dirname, 'seed-data', 'blog-articles.json'), 'utf8')
);

type SeedProduct = {
	slug: string;
	orderKey: string;
	priceInMinorUnits: number;
	siteLocations: string[];
	names: Record<string, string>;
};

/**
 * The live Stripe catalog of the legacy site. `orderKey` mirrors the order of
 * the legacy registration dropdown; the price list sorts by it too, so `0`
 * puts the plain consultation first, exactly like the old price list page.
 */
const PRODUCTS: SeedProduct[] = [
	{
		slug: 'psychotherapy-consultation',
		orderKey: '0',
		priceInMinorUnits: 25000,
		// Price list only - the page lists every active product regardless of location.
		siteLocations: [],
		names: {
			'pl-PL': 'Konsultacja psychoterapeutyczna',
			'uk-UA': 'Психотерапевтична консультація'
		}
	},
	{
		slug: 'psychotherapy-for-women',
		orderKey: 'a',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia dla kobiet (50 min.)',
			'uk-UA': 'Психотерапія для жінок (50 хв.)'
		}
	},
	{
		slug: 'eating-disorders-psychotherapy',
		orderKey: 'b',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia zaburzeń odżywiania (50 min.)',
			'uk-UA': 'Психотерапія розладів харчової поведінки (50 хв.)'
		}
	},
	{
		slug: 'couples-psychotherapy',
		orderKey: 'c',
		priceInMinorUnits: 35000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia pary (75 min.)',
			'uk-UA': 'Психотерапія для пар (75 хв.)'
		}
	},
	{
		slug: 'lgbtq-psychotherapy',
		orderKey: 'd',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia dla osób LGBTQ+ (50 min.)',
			'uk-UA': 'Психотерапія для осіб ЛГБТК+ (50 хв.)'
		}
	},
	{
		slug: 'psychotherapy-for-parents',
		orderKey: 'e',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia dla rodziców (50 min.)',
			'uk-UA': 'Психотерапія для батьків (50 хв.)'
		}
	},
	{
		slug: 'depression-and-anxiety-psychotherapy',
		orderKey: 'f',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia depresji i zaburzeń lękowych (50 min.)',
			'uk-UA': 'Психотерапія депресії та тривожних розладів (50 хв.)'
		}
	}
];

function stripHtml(html: string): string {
	return (html ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function truncate(value: string, max: number): string {
	if (value.length <= max) {
		return value;
	}

	const cut = value.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');

	return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** Mirrors `buildArticleJsonLD` in `src/shared/server/functions/json-ld.ts`. */
function buildArticleJsonLD(args: {
	lang: string;
	slug: string;
	title: string;
	description: string;
	datePublished: Date;
	dateModified: Date;
}) {
	const url = `${SITE_URL}/${HTML_LANG[args.lang]}/blog/${args.slug}`;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: args.title,
		description: args.description,
		inLanguage: HTML_LANG[args.lang],
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		datePublished: args.datePublished.toISOString(),
		dateModified: args.dateModified.toISOString(),
		author: { '@type': 'Person', name: 'Olesya Haiduk', url: `${SITE_URL}/pl/home` },
		publisher: {
			'@type': 'Organization',
			name: 'Bezstresowo',
			url: `${SITE_URL}/pl/home`,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/header-logo.svg` }
		}
	};
}

/** Mirrors `buildProductJsonLD` in `src/shared/server/functions/json-ld.ts`. */
function buildProductJsonLD(args: { lang: string; name: string; priceInMinorUnits: number }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: args.name,
		description: '',
		inLanguage: HTML_LANG[args.lang],
		url: `${SITE_URL}/${HTML_LANG[args.lang]}/shop`,
		brand: { '@type': 'Brand', name: 'Bezstresowo' },
		offers: {
			'@type': 'Offer',
			priceCurrency: PRODUCT_CURRENCY,
			price: (args.priceInMinorUnits / 100).toFixed(2),
			availability: 'https://schema.org/InStock'
		}
	};
}

const prisma = new PrismaClient();

async function seedBlogArticles() {
	console.log('== Blog articles ==');

	let createdArticles = 0;
	let createdTranslations = 0;
	let skipped = 0;

	for (const article of ARTICLES) {
		const createdAt = new Date(article.createdAt);
		const updatedAt = new Date(article.updatedAt);
		const slug = article.slug;

		const rows = Object.entries(article.translations).map(([lang, translation]) => {
			const title = translation.title.trim();
			const plainText = stripHtml(translation.content);
			const metaTitle = truncate(title, META_TITLE_MAX_LENGTH);
			const metaDescription = truncate(plainText || title, META_DESCRIPTION_MAX_LENGTH);

			return {
				lang,
				disabled: false,
				title,
				content: translation.content,
				metaTitle,
				metaDescription,
				// The legacy articles carry no media - see the snapshot.
				featuredImageId: null,
				featuredImageAlt: null,
				mediaIds: [] as string[],
				metadataJsonLD: buildArticleJsonLD({
					lang,
					slug,
					title: metaTitle,
					description: metaDescription,
					datePublished: createdAt,
					dateModified: updatedAt
				}),
				createdAt,
				updatedAt
			};
		});

		// An earlier (e.g. polish-only) run may have created this article
		// already - attach the missing language versions instead of skipping.
		const existing = await prisma.blogArticle.findFirst({
			where: { slug },
			select: { id: true }
		});

		if (existing) {
			const presentLanguages = new Set(
				(
					await prisma.internationalizedBlogArticle.findMany({
						where: { blogArticleId: existing.id },
						select: { lang: true }
					})
				).map((row) => row.lang)
			);

			for (const row of rows) {
				if (presentLanguages.has(row.lang)) {
					console.log(`- ${slug} (${row.lang}): already exists, skipped`);
					skipped++;
					continue;
				}

				console.log(`- "${row.title}" -> /${HTML_LANG[row.lang]}/blog/${slug}`);

				if (!DRY_RUN) {
					await prisma.internationalizedBlogArticle.create({
						data: { ...row, blogArticleId: existing.id }
					});
				}

				createdTranslations++;
			}

			continue;
		}

		for (const row of rows) {
			console.log(`- "${row.title}" -> /${HTML_LANG[row.lang]}/blog/${slug}`);
		}

		if (!DRY_RUN) {
			await prisma.blogArticle.create({
				data: {
					slug,
					createdAt,
					updatedAt,
					internationalizedArticles: { create: rows }
				}
			});
		}

		createdArticles++;
		createdTranslations += rows.length;
	}

	console.log(
		`${DRY_RUN ? '[dry run] ' : ''}Created ${createdArticles} article(s), ` +
			`${createdTranslations} translation(s), skipped ${skipped}.`
	);
}

async function seedProducts() {
	console.log('== Products ==');

	let created = 0;
	let skipped = 0;

	for (const product of PRODUCTS) {
		const existing = await prisma.product.findFirst({
			where: { slug: product.slug },
			select: { id: true }
		});

		if (existing) {
			console.log(`- ${product.slug}: already exists, skipped`);
			skipped++;
			continue;
		}

		const price = (product.priceInMinorUnits / 100).toFixed(2);
		console.log(`- ${product.slug}: "${product.names['pl-PL']}" ${price} ${PRODUCT_CURRENCY}`);

		if (DRY_RUN) {
			created++;
			continue;
		}

		// Mirrors `createProduct` in `src/remote/admin-products.remote.ts`.
		await prisma.product.create({
			data: {
				slug: product.slug,
				active: true,
				siteLocations: product.siteLocations,
				orderKey: product.orderKey,
				price: {
					create: {
						currency: PRODUCT_CURRENCY,
						inMinorUnits: product.priceInMinorUnits
					}
				},
				internationalizedProducts: {
					create: Object.entries(product.names).map(([lang, name]) => ({
						lang,
						name,
						description: '',
						mediaIds: [],
						metadataJsonLD: buildProductJsonLD({
							lang,
							name,
							priceInMinorUnits: product.priceInMinorUnits
						})
					}))
				}
			}
		});

		created++;
	}

	console.log(`${DRY_RUN ? '[dry run] ' : ''}Created ${created} product(s), skipped ${skipped}.`);
}

async function main() {
	await seedBlogArticles();
	console.log('');
	await seedProducts();
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
