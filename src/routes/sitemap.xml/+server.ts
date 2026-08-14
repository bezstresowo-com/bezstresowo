import { Locale } from '$i18n';
import { alternateUrl, hreflang, xDefaultUrl, type SeoAlternate } from '$lib/Seo/model';
import { prisma } from '$shared/server/services/prisma/prisma-service';

import type { RequestHandler } from './$types';

/**
 * Indexable static pages; everything rendered with `noindex` (gdpr, regulamin,
 * payment results) intentionally stays out of the sitemap.
 */
const STATIC_PAGES = ['/home', '/registrations', '/blog', '/price-list', '/shop'];

/**
 * The sitemap is computed at request time so articles published from the admin
 * panel show up without a redeploy; the response is cached for an hour.
 */
export const GET: RequestHandler = async () => {
	const entries: string[] = [];

	for (const path of STATIC_PAGES) {
		const alternates = Object.values(Locale).map((locale) => ({ locale, path }));

		for (const alternate of alternates) {
			entries.push(urlEntry(alternate, alternates));
		}
	}

	const articles = await prisma.internationalizedBlogArticle.findMany({
		select: { slug: true, lang: true, updatedAt: true, blogArticleId: true }
	});

	const byArticle = new Map<string, typeof articles>();

	for (const article of articles) {
		if (!(Object.values(Locale) as string[]).includes(article.lang)) {
			continue;
		}

		byArticle.set(article.blogArticleId, [
			...(byArticle.get(article.blogArticleId) ?? []),
			article
		]);
	}

	for (const versions of byArticle.values()) {
		const alternates = versions.map((version) => ({
			locale: version.lang as Locale,
			path: `/blog/${version.slug}`
		}));

		for (const [index, alternate] of alternates.entries()) {
			entries.push(urlEntry(alternate, alternates, versions[index].updatedAt));
		}
	}

	const xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
		entries.join('\n') +
		'\n</urlset>\n';

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};

/** One `<url>` element with the same hreflang alternates the page itself emits. */
function urlEntry(alternate: SeoAlternate, alternates: SeoAlternate[], lastmod?: Date): string {
	const links = [
		...alternates.map(
			(candidate) =>
				`<xhtml:link rel="alternate" hreflang="${hreflang(candidate.locale)}" href="${alternateUrl(candidate)}"/>`
		),
		`<xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl(alternates)}"/>`
	];

	return [
		'<url>',
		`<loc>${alternateUrl(alternate)}</loc>`,
		...(lastmod ? [`<lastmod>${lastmod.toISOString()}</lastmod>`] : []),
		...links,
		'</url>'
	].join('');
}
