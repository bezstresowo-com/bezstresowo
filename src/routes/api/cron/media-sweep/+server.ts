import { env } from '$env/dynamic/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { reconcileBucket } from '$shared/server/functions/media-cleanup';
import { json } from '@sveltejs/kit';
import { timingSafeEqual } from 'node:crypto';

import type { RequestHandler } from './$types';

const DEFAULT_GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

/**
 * Reconciliation sweep over the media bucket - the actual guarantee that no
 * object is ever orphaned. Requires `CRON_SECRET` as a bearer token.
 *
 * Exposed on GET as well as POST: Vercel cron (`vercel.json`) only ever issues
 * GET requests, attaching `Authorization: Bearer $CRON_SECRET` on its own.
 *
 * `?dryRun=1` reports what would be deleted without deleting anything.
 */
const sweep: RequestHandler = async ({ request, url }) => {
	// `$env/dynamic` on purpose: the check below is fail-closed anyway, and a
	// `$env/static` import would fail the build wherever the secret is not set.
	if (!isAuthorized(request.headers.get('authorization'), env.CRON_SECRET)) {
		return json({ message: 'api.errors.UNAUTHORIZED' }, { status: HttpStatus.UNAUTHORIZED });
	}

	const gracePeriodMs = Number(url.searchParams.get('gracePeriodMs') ?? DEFAULT_GRACE_PERIOD_MS);

	const report = await reconcileBucket({
		gracePeriodMs: Number.isFinite(gracePeriodMs) ? gracePeriodMs : DEFAULT_GRACE_PERIOD_MS,
		dryRun: url.searchParams.get('dryRun') === '1'
	});

	console.info('[media-sweep]', report);

	return json(report);
};

/** Constant time comparison - the token gates irreversible file deletion. */
function isAuthorized(header: string | null, secret: string | undefined): boolean {
	if (!secret) {
		return false;
	}

	const expected = Buffer.from(`Bearer ${secret}`);
	const provided = Buffer.from(header ?? '');

	return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export const GET = sweep;
export const POST = sweep;
