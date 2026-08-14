import { env } from '$env/dynamic/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { reconcileBucket } from '$shared/server/functions/media-cleanup';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

const DEFAULT_GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

/**
 * Reconciliation sweep over the media bucket - the actual guarantee that no
 * object is ever orphaned. Point a scheduler (Netlify scheduled function, cron,
 * uptime pinger) at it and send `CRON_SECRET` as a bearer token.
 *
 * `?dryRun=1` reports what would be deleted without deleting anything.
 */
export const POST: RequestHandler = async ({ request, url }) => {
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
