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
 *  3. The "About me" section - the legacy hardcoded texts (previously part of
 *     the translation dictionaries) as TipTap HTML, plus the portrait from
 *     `static/assets/about-me.jpg` uploaded to the bucket.
 *  4. Certificates - every image in `static/assets/certs`, uploaded to the
 *     bucket. The two newest (`cert-17`, `cert-18`) lead the gallery, the
 *     legacy ones follow in their original order.
 *
 * Sections 3 and 4 talk to the media bucket, so a non-dry run needs the
 * `AWS_S3_*` variables next to `DATABASE_URL`.
 *
 *   npm run prisma:seed             # writes to DATABASE_URL from .env
 *   npm run prisma:seed -- --dry-run
 *
 * Runs through `tsx` - the generated prisma client is typescript with
 * extensionless imports, which plain `node` cannot resolve. Safe to re-run:
 * existing slugs are skipped, language versions missing from an already
 * seeded article are attached to it, an existing bio row is left untouched
 * and already uploaded certificates are skipped (matched by bucket key).
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

/**
 * The "About me" texts the site used to hardcode in its translation
 * dictionaries, converted to the TipTap HTML the panel edits (`/admin/bio`).
 */
const BIO_CONTENTS: Record<string, string> = {
	'pl-PL': [
		'Nazywam się <strong>Olesya Haiduk</strong>.',
		'Jestem psychoterapeutką po ukończonym 4-letnim szkoleniu psychoterapeutycznym w Międzynarodowym Towarzystwie Analizy Transakcyjnej. Prowadzę indywidualną psychoterapię dla kobiet, psychoterapię grupową z młodzieżą i osobami dorosłymi, a także psychoterapię dla par.',
		'Pracuję z osobami, które zmagają się z zaburzeniami odżywiania, zaburzeniami lękowymi, problemami w określeniu tożsamości i wyrażaniu emocji, depresją, stanami lękowymi, współzależnymi relacjami, niską samooceną, problemami społecznymi oraz traumatycznymi przeżyciami. Z pełnym zaangażowaniem wspieram także osoby z grupy LGBT+, zapewniając im przestrzeń opartą na akceptacji, zrozumieniu oraz profesjonalnym wsparciu.',
		'Specjalizuję się w nurcie analizy transakcyjnej opierającej się na zapoznaniu się klienta ze schematami, jakie występują w jego i otoczenia postępowaniu, zwłaszcza w komunikacji, a także rolami, w jakie wchodzimy w relacjach. W swoich działaniach opieram się na kodeksie etycznym psychoterapeuty, buduję z klientem przestrzeń opartą na zaufaniu, poczuciu bezpieczeństwa i akceptacji.',
		'W trosce o jak najwyższe standardy mojej pracy nieustannie rozwijam swoje umiejętności poprzez udział w licznych kursach, konferencjach i szkoleniach zawodowych. Pracuję pod stałą opieką superwizorów.',
		'Moim priorytetem jest zawsze zapewnienie klientom bezpiecznej, wspierającej przestrzeni, w której mogą poczuć się zrozumiani i akceptowani. W swojej pracy kieruję się wysokimi standardami etycznymi, pełnym szacunkiem oraz zaangażowaniem. Z pasją i profesjonalizmem wspieram osoby w dążeniu do poprawy jakości ich życia oraz w procesie radzenia sobie z trudnościami, zarówno emocjonalnymi, jak i społecznymi. Serdecznie zapraszam do kontaktu i rozpoczęcia wspólnej drogi ku lepszemu samopoczuciu oraz zdrowiu psychicznemu. Oferuję pomoc, zapewniając wsparcie dostosowane do indywidualnych potrzeb.'
	]
		.map((paragraph) => `<p>${paragraph}</p>`)
		.join(''),
	'uk-UA': [
		'Мене звати <strong>Олеся Гайдук</strong>.',
		'Я психотерапевтка, із завершеним 4-річним циклом навчання в Міжнародному Товаристві Транзакційного Аналізу. Проводжу індивідуальну психотерапію для жінок, а також терапію для пар.',
		'Я працюю з людьми, які зіткнулися з такими труднощами, як: розлади харчової поведінки, тривожні розлади, депресія, низька самооцінка та труднощі у стосунках, проблеми з вираженням емоцій та визначенням власної ідентичності, співзалежні стосунки, травматичні переживання та соціальні труднощі. З теплом підтримую також представників спільноти LGBT+, створюючи простір прийняття, розуміння та професійної підтримки.',
		'Моя спеціалізація — транзакційний аналіз. Це модальність, яка допомагає зрозуміти повторювані схеми у спілкуванні, ролі, які ми беремо у стосунках, а також механізми, що заважають нам будувати гармонійне життя. У своїй роботі я опираюсь на етичний кодекс психолога і психотерапевта, дбаю про створення простору довіри, безпеки й прийняття.',
		'Постійно вдосконалюю свої знання й навички, беручи участь у курсах, тренінгах та конференціях. Працюю під регулярною супервізією, щоб гарантувати моїм клієнтам найвищі стандарти допомоги.',
		'Моя мета - підтримувати людей у процесі змін, допомагаючи їм знаходити внутрішні ресурси, покращувати якість життя та відчувати себе цілісно й глибоко прийнятими. Кожен заслуговує на простір, де його чують і розуміють. Щиро запрошую до контакту. Пропоную допомогу індивідуально, у парі чи групі - залежно від ваших потреб, а також тренінги з навичок комунікації для працівників фірм.'
	]
		.map((paragraph) => `<p>${paragraph}</p>`)
		.join('')
};

/** The portrait shown next to the bio, shared by every language version. */
const BIO_IMAGE = { file: 'about-me.jpg', bucketKey: 'seed-about-me.jpg' };

/**
 * Gallery order: the two newest certificates (not yet on the legacy site) go
 * on top, the legacy ones follow in their original order.
 */
const CERTIFICATE_FILES = [
	'cert-17.jpg',
	'cert-18.jpg',
	...Array.from({ length: 17 }, (_, i) => `cert-${i}.jpg`)
];

const STATIC_ASSETS_DIR = path.join(import.meta.dirname, '..', 'static', 'assets');

/**
 * Mirrors `S3Service` (`src/shared/server/services/s3/s3-service.ts`), which
 * cannot be imported here - it reads its config through SvelteKit's
 * `$env/static/private`, a module that only exists inside the app build.
 */
function createS3Client(): S3Client {
	const missing = [
		'AWS_S3_ACCESS_KEY_ID',
		'AWS_S3_SECRET_ACCESS_KEY',
		'AWS_S3_REGION',
		'AWS_S3_BUCKET_NAME'
	].filter((name) => !process.env[name]);

	if (missing.length > 0) {
		throw new Error(`Missing environment variables for bucket uploads: ${missing.join(', ')}`);
	}

	const endpoint = process.env.AWS_S3_ENDPOINT;

	return new S3Client({
		region: process.env.AWS_S3_REGION,
		credentials: {
			accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
			secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!
		},
		// A custom endpoint (e.g. local MinIO) needs path-style addressing.
		...(endpoint ? { endpoint, forcePathStyle: true } : {})
	});
}

async function uploadStaticAsset(s3: S3Client, relativePath: string, bucketKey: string) {
	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: bucketKey,
			Body: readFileSync(path.join(STATIC_ASSETS_DIR, relativePath)),
			ContentType: 'image/jpeg'
		})
	);
}

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

async function seedBio() {
	console.log('== About me (bio) ==');

	// The panel may have edited the singleton already - never overwrite it.
	const existing = await prisma.bio.findFirst({ select: { id: true } });

	if (existing) {
		console.log('- bio: already exists, skipped');
		return;
	}

	const languages = Object.keys(BIO_CONTENTS);
	console.log(`- bio (${languages.join(', ')}) with portrait "${BIO_IMAGE.file}"`);

	if (DRY_RUN) {
		console.log('[dry run] Created 1 bio.');
		return;
	}

	await uploadStaticAsset(createS3Client(), BIO_IMAGE.file, BIO_IMAGE.bucketKey);

	await prisma.bio.create({
		data: {
			imageId: BIO_IMAGE.bucketKey,
			internationalizedBios: {
				create: Object.entries(BIO_CONTENTS).map(([lang, content]) => ({
					lang,
					content,
					mediaIds: []
				}))
			}
		}
	});

	console.log('Created 1 bio.');
}

async function seedCertificates() {
	console.log('== Certificates ==');

	let created = 0;
	let skipped = 0;
	let s3: S3Client | null = null;

	for (const [index, file] of CERTIFICATE_FILES.entries()) {
		const bucketKey = `seed-${file}`;

		// Matched by bucket key, so a re-run never duplicates a certificate. If
		// the panel reordered the gallery meanwhile, a late create with the seed
		// position may interleave - the panel heals that with one reorder.
		const existing = await prisma.certificate.findFirst({
			where: { imageId: bucketKey },
			select: { id: true }
		});

		if (existing) {
			console.log(`- ${file}: already exists, skipped`);
			skipped++;
			continue;
		}

		console.log(`- ${file} -> position ${index + 1}`);

		if (DRY_RUN) {
			created++;
			continue;
		}

		s3 ??= createS3Client();
		await uploadStaticAsset(s3, path.join('certs', file), bucketKey);

		// Alt texts start empty - the section falls back to a numbered label
		// until they are filled in on `/admin/certificates`.
		await prisma.certificate.create({
			data: { imageId: bucketKey, order: index, altTexts: {} }
		});

		created++;
	}

	console.log(
		`${DRY_RUN ? '[dry run] ' : ''}Created ${created} certificate(s), skipped ${skipped}.`
	);
}

async function main() {
	await seedBlogArticles();
	console.log('');
	await seedProducts();
	console.log('');
	await seedBio();
	console.log('');
	await seedCertificates();
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
