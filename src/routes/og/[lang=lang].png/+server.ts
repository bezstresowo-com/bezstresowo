import { toLocale, translationsFor, type Locale } from '$i18n';
import { HttpStatus } from '$shared/global/enums/http-status';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import { Resvg } from '@resvg/resvg-js';
import { redirect } from '@sveltejs/kit';
import satori from 'satori';

import cyrillic400 from '@fontsource/roboto/files/roboto-cyrillic-400-normal.woff?inline';
import cyrillic700 from '@fontsource/roboto/files/roboto-cyrillic-700-normal.woff?inline';
import latin400 from '@fontsource/roboto/files/roboto-latin-400-normal.woff?inline';
import latin700 from '@fontsource/roboto/files/roboto-latin-700-normal.woff?inline';
import latinExt400 from '@fontsource/roboto/files/roboto-latin-ext-400-normal.woff?inline';
import latinExt700 from '@fontsource/roboto/files/roboto-latin-ext-700-normal.woff?inline';

import type { RequestHandler } from './$types';

const WIDTH = 1200;
const HEIGHT = 630;

/** Brand palette, mirrors `src/app.css`. */
const COLORS = {
	primary: '#3b4a63',
	secondary: '#f0d29b',
	accent: '#e3b25c',
	background: '#f7f2e9'
};

/** Warm-function cache; the CDN caches the immutable response on top of it. */
const CACHE = new Map<string, Uint8Array>();
const CACHE_LIMIT = 64;

/**
 * Every distinct title is a full satori + resvg render, and the title is an
 * arbitrary query parameter - without a cap a single client can bypass both
 * caches at will and burn CPU for free.
 */
const renderLimiter = createRateLimiter({ max: 20, windowMs: 60_000 });

export const GET: RequestHandler = async (event) => {
	const { params, url } = event;
	const locale = toLocale(params.lang);
	const title = (url.searchParams.get('title') ?? '').slice(0, 120).trim();
	const subtitle = (url.searchParams.get('subtitle') ?? '').slice(0, 180).trim();

	if (title.length === 0) {
		// Nothing to render from - fall back to the static brand image.
		redirect(HttpStatus.FOUND, '/site-preview.jpeg');
	}

	const cacheKey = `${locale}|${title}|${subtitle}`;
	const cached = CACHE.get(cacheKey);

	if (cached) {
		return pngResponse(cached);
	}

	// Only uncached (= actually rendering) requests count against the limit.
	if (!renderLimiter.consume(clientAddress(event))) {
		return new Response('Too Many Requests', { status: HttpStatus.TOO_MANY_REQUESTS });
	}

	try {
		const png = await render(locale, title, subtitle);

		if (CACHE.size >= CACHE_LIMIT) {
			CACHE.delete(CACHE.keys().next().value as string);
		}
		CACHE.set(cacheKey, png);

		return pngResponse(png);
	} catch (error) {
		console.error('[og] failed to render the preview image', error);

		// The caching headers below must never end up on this redirect: a
		// transient failure would otherwise be cached for a year.
		redirect(HttpStatus.FOUND, '/site-preview.jpeg');
	}
};

/** Not every adapter can resolve the caller's address - fall back to a shared bucket. */
function clientAddress(event: Parameters<RequestHandler>[0]): string {
	try {
		return event.getClientAddress();
	} catch {
		return 'unknown';
	}
}

function pngResponse(png: Uint8Array) {
	return new Response(png as BodyInit, {
		headers: {
			'content-type': 'image/png',
			// The title is part of the URL, so a changed title is a changed URL.
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
}

async function render(locale: Locale, title: string, subtitle: string) {
	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '64px 72px',
					backgroundColor: COLORS.primary,
					fontFamily: FONT_STACK
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								fontSize: 40,
								fontWeight: 700,
								letterSpacing: '0.08em',
								color: COLORS.accent
							},
							children: translationsFor(locale).meta.siteName
						}
					},
					{
						type: 'div',
						props: {
							style: { display: 'flex', flexDirection: 'column', gap: 24 },
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											fontSize: title.length > 60 ? 56 : 68,
											fontWeight: 700,
											lineHeight: 1.15,
											color: COLORS.background
										},
										children: title
									}
								},
								...(subtitle
									? [
											{
												type: 'div',
												props: {
													style: {
														display: 'flex',
														fontSize: 30,
														lineHeight: 1.4,
														color: COLORS.secondary
													},
													children: subtitle
												}
											}
										]
									: [])
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								fontSize: 26,
								color: COLORS.secondary
							},
							children: [
								{
									type: 'div',
									props: { style: { display: 'flex' }, children: 'Olesya Haiduk' }
								},
								{
									type: 'div',
									props: { style: { display: 'flex' }, children: 'bezstresowo.org' }
								}
							]
						}
					}
				]
			}
		},
		{ width: WIDTH, height: HEIGHT, fonts: FONTS }
	);

	return new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
}

function decode(dataUrl: string) {
	return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
}

/**
 * Roboto subsets covering polish (latin + latin-ext) and ukrainian (cyrillic).
 * Inlined as data URLs so the serverless bundle carries the fonts with it.
 *
 * Satori only falls back between fonts with *different* family names, hence the
 * three families and the explicit stack below.
 */
const FONTS = [
	{ name: 'Roboto', data: decode(latin400), weight: 400 as const, style: 'normal' as const },
	{ name: 'RobotoExt', data: decode(latinExt400), weight: 400 as const, style: 'normal' as const },
	{ name: 'RobotoCyr', data: decode(cyrillic400), weight: 400 as const, style: 'normal' as const },
	{ name: 'Roboto', data: decode(latin700), weight: 700 as const, style: 'normal' as const },
	{ name: 'RobotoExt', data: decode(latinExt700), weight: 700 as const, style: 'normal' as const },
	{ name: 'RobotoCyr', data: decode(cyrillic700), weight: 700 as const, style: 'normal' as const }
];

const FONT_STACK = 'Roboto, RobotoExt, RobotoCyr';
