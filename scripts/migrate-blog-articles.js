/**
 * One-off migration: legacy (pre 13.08.2026) blog articles were single language
 * documents with `title` / `content` / `mediaIds` stored straight on
 * `BlogArticle`. They are all written in polish, so each one becomes a
 * `BlogArticle` with a single `InternationalizedBlogArticle` (`lang: pl-PL`).
 *
 *   node scripts/migrate-blog-articles.js [--dry-run]
 *
 * Safe to re-run: articles that already have a translation row are skipped.
 */

import { PrismaClient } from '../src/shared/server/generated/prisma/client.js';

const DRY_RUN = process.argv.includes('--dry-run');
const LANG = 'pl-PL';
const META_TITLE_MAX_LENGTH = 60;
const META_DESCRIPTION_MAX_LENGTH = 155;
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://bezstresowo.org').replace(/\/+$/, '');

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

async function main() {
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

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
