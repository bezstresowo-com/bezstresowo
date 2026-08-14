/**
 * One-off migration of production data, two idempotent steps:
 *
 *  1. Blog articles - legacy (pre 13.08.2026) articles were single language
 *     documents with `title` / `content` / `mediaIds` stored straight on
 *     `BlogArticle`. They are all written in polish, so each one becomes a
 *     `BlogArticle` with a single `InternationalizedBlogArticle` (`lang: pl-PL`).
 *  2. Products - the legacy site read products and prices from Stripe; the app
 *     now owns them in the database. The live Stripe catalog (fetched from the
 *     old production API on 14.08.2026) is recreated here with polish and
 *     ukrainian translations.
 *
 *   DATABASE_URL="<prod url>" npm run migrate:prod-data -- --dry-run
 *
 * Runs through `tsx` - the generated prisma client is typescript with
 * extensionless imports, which plain `node` cannot resolve.
 * Safe to re-run: articles that already have a translation row and products
 * whose slug already exists are skipped.
 */

import { PrismaClient } from '../src/shared/server/generated/prisma/client.js';

const DRY_RUN = process.argv.includes('--dry-run');
const LANG = 'pl-PL';
const META_TITLE_MAX_LENGTH = 60;
const META_DESCRIPTION_MAX_LENGTH = 155;
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://bezstresowo.org').replace(/\/+$/, '');

const PRODUCT_CURRENCY = 'PLN';

/** `<html lang>` tag per supported locale, mirrors `LOCALE_HTML_LANG`. */
const HTML_LANG = { 'pl-PL': 'pl', 'uk-UA': 'uk' };

/**
 * The live Stripe catalog of the legacy site. `orderKey` mirrors the Stripe
 * `orderKey` metadata; the price list sorts by it too, so `0` puts the plain
 * consultation first, exactly like the old price list page.
 */
const PRODUCTS = [
	{
		slug: 'konsultacja-psychoterapeutyczna',
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
		slug: 'psychoterapia-dla-kobiet',
		orderKey: 'a',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia dla kobiet (50 min.)',
			'uk-UA': 'Психотерапія для жінок (50 хв.)'
		}
	},
	{
		slug: 'psychoterapia-zaburzen-odzywiania',
		orderKey: 'b',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia zaburzeń odżywiania (50 min.)',
			'uk-UA': 'Психотерапія розладів харчової поведінки (50 хв.)'
		}
	},
	{
		slug: 'psychoterapia-pary',
		orderKey: 'c',
		priceInMinorUnits: 35000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia pary (75 min.)',
			'uk-UA': 'Психотерапія для пар (75 хв.)'
		}
	},
	{
		slug: 'psychoterapia-dla-osob-lgbtq',
		orderKey: 'd',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia dla osób LGBTQ+ (50 min.)',
			'uk-UA': 'Психотерапія для осіб ЛГБТК+ (50 хв.)'
		}
	},
	{
		slug: 'psychoterapia-dla-rodzicow',
		orderKey: 'e',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia dla rodziców (50 min.)',
			'uk-UA': 'Психотерапія для батьків (50 хв.)'
		}
	},
	{
		slug: 'psychoterapia-depresji-i-zaburzen-lekowych',
		orderKey: 'f',
		priceInMinorUnits: 25000,
		siteLocations: ['registrations', 'shop'],
		names: {
			'pl-PL': 'Psychoterapia depresji i zaburzeń lękowych (50 min.)',
			'uk-UA': 'Психотерапія депресії та тривожних розладів (50 хв.)'
		}
	}
];

const TRANSLITERATION = {
	ą: 'a',
	ć: 'c',
	ę: 'e',
	ł: 'l',
	ń: 'n',
	ó: 'o',
	ś: 's',
	ź: 'z',
	ż: 'z'
};

function slugify(value) {
	return value
		.toLowerCase()
		.split('')
		.map((char) => TRANSLITERATION[char] ?? char)
		.join('')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80)
		.replace(/-+$/g, '');
}

function stripHtml(html) {
	return (html ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function truncate(value, max) {
	if (value.length <= max) {
		return value;
	}

	const cut = value.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');

	return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function buildArticleJsonLD({ slug, title, description, datePublished, dateModified }) {
	const url = `${SITE_URL}/pl/blog/${slug}`;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		inLanguage: 'pl',
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		datePublished: datePublished.toISOString(),
		dateModified: dateModified.toISOString(),
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
function buildProductJsonLD({ lang, name, priceInMinorUnits }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name,
		description: '',
		inLanguage: HTML_LANG[lang],
		url: `${SITE_URL}/${HTML_LANG[lang]}/shop`,
		brand: { '@type': 'Brand', name: 'Bezstresowo' },
		offers: {
			'@type': 'Offer',
			priceCurrency: PRODUCT_CURRENCY,
			price: (priceInMinorUnits / 100).toFixed(2),
			availability: 'https://schema.org/InStock'
		}
	};
}

function toDate(value) {
	if (value instanceof Date) return value;
	if (value && typeof value === 'object' && '$date' in value) return new Date(value.$date);
	return value ? new Date(value) : new Date();
}

function toId(value) {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object' && '$oid' in value) return value.$oid;
	return String(value);
}

const prisma = new PrismaClient();

async function migrateBlogArticles() {
	console.log('== Blog articles ==');

	// The legacy fields no longer exist in the prisma schema, so read them raw.
	const found = await prisma.$runCommandRaw({
		find: 'BlogArticle',
		filter: { title: { $exists: true } },
		batchSize: 1000
	});

	const legacyArticles = found?.cursor?.firstBatch ?? [];

	if (legacyArticles.length === 0) {
		console.log('Nothing to migrate - no legacy blog articles found.');
		return;
	}

	console.log(`Found ${legacyArticles.length} legacy article(s).`);

	const takenSlugs = new Set(
		(await prisma.internationalizedBlogArticle.findMany({ select: { slug: true } })).map(
			(row) => row.slug
		)
	);

	let migrated = 0;
	let skipped = 0;

	for (const legacy of legacyArticles) {
		const id = toId(legacy._id);
		const title = String(legacy.title ?? '').trim();

		if (title.length === 0) {
			console.warn(`- ${id}: no title, skipped`);
			skipped++;
			continue;
		}

		const alreadyMigrated = await prisma.internationalizedBlogArticle.count({
			where: { blogArticleId: id }
		});

		if (alreadyMigrated > 0) {
			console.log(`- ${id}: already has translations, skipped`);
			skipped++;
			continue;
		}

		const content = String(legacy.content ?? '');
		const plainText = stripHtml(content);

		let slug = slugify(String(legacy.slug ?? '') || title) || `article-${id}`;
		let suffix = 2;
		while (takenSlugs.has(slug)) {
			slug = `${slugify(title)}-${suffix++}`;
		}
		takenSlugs.add(slug);

		const createdAt = toDate(legacy.createdAt);
		const updatedAt = toDate(legacy.updatedAt ?? legacy.createdAt);
		const mediaIds = Array.isArray(legacy.mediaIds) ? legacy.mediaIds.map(String) : [];
		const metaTitle = truncate(title, META_TITLE_MAX_LENGTH);
		const metaDescription = truncate(plainText || title, META_DESCRIPTION_MAX_LENGTH);

		console.log(`- ${id}: "${title}" -> /pl/blog/${slug}`);

		if (DRY_RUN) {
			migrated++;
			continue;
		}

		await prisma.internationalizedBlogArticle.create({
			data: {
				blogArticleId: id,
				lang: LANG,
				slug,
				title,
				content,
				metaTitle,
				metaDescription,
				featuredImageId: mediaIds[0] ?? null,
				featuredImageAlt: null,
				mediaIds,
				metadataJsonLD: buildArticleJsonLD({
					slug,
					title: metaTitle,
					description: metaDescription,
					datePublished: createdAt,
					dateModified: updatedAt
				}),
				createdAt,
				updatedAt
			}
		});

		// Drop the legacy single language fields from the parent document.
		await prisma.$runCommandRaw({
			update: 'BlogArticle',
			updates: [
				{
					q: { _id: { $oid: id } },
					u: { $unset: { title: '', content: '', mediaIds: '', slug: '' } }
				}
			]
		});

		migrated++;
	}

	console.log(`${DRY_RUN ? '[dry run] ' : ''}Migrated ${migrated} article(s), skipped ${skipped}.`);
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
	await migrateBlogArticles();
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
