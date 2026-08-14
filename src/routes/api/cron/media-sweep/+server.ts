import { env } from '$env/dynamic/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { reconcileBucket } from '$shared/server/functions/media-cleanup';
import { json } from '@sveltejs/kit';

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
	const secret = env.CRON_SECRET;

	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
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

export const GET = sweep;
export const POST = sweep;
