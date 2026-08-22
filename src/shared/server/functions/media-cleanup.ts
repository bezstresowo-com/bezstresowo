import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { difference, isNil } from 'lodash-es';

/**
 * Media lifecycle utilities shared by every model that carries `mediaIds`
 * (blog articles, products, whatever comes next).
 *
 * Deliberately NOT implemented as prisma extensions: extensions only intercept
 * top level client calls, so they miss `$runCommandRaw`, direct mongo access,
 * cascading deletes and nested relational writes. The guarantee here is instead
 * built from two layers:
 *
 *  1. `cleanupMedia` - explicit, called right after a mutation commits. Removes
 *     files of deleted rows and files dropped from a row's `mediaIds`.
 *  2. `reconcileBucket` - a cron sweep that diffs the bucket against every
 *     `mediaIds` array in the database. This is the actual guarantee: it also
 *     catches raw writes, crashes between commit and cleanup, and changes made
 *     outside the app.
 */

/** Every model that stores bucket object keys in a `mediaIds` array. */
const MEDIA_OWNERS = [
	() => prisma.internationalizedBlogArticle.findMany({ select: { mediaIds: true } }),
	() => prisma.internationalizedProduct.findMany({ select: { mediaIds: true } }),
	productImageRows,
	legacyBlogArticleRows
] as const;

/** A product's one shared image lives on the `Product` row itself (`imageId`),
 * not in a translation's `mediaIds` - surface it in the same shape. */
async function productImageRows(): Promise<{ mediaIds: string[] }[]> {
	const products = await prisma.product.findMany({ select: { imageId: true } });

	return products.map(({ imageId }) => ({ mediaIds: isNil(imageId) ? [] : [imageId] }));
}

/**
 * Legacy (pre-i18n) articles keep `mediaIds` directly on the `BlogArticle`
 * document. Those fields are gone from the prisma schema, so they are only
 * reachable raw. This stays as long as a database with legacy documents (the
 * one the old site wrote to) can be swept - without it, a sweep would
 * irreversibly wipe the images of the old articles. On a fresh, seeded
 * database the query simply returns nothing.
 */
async function legacyBlogArticleRows(): Promise<{ mediaIds: string[] }[]> {
	const response = (await prisma.$runCommandRaw({
		find: 'BlogArticle',
		filter: { mediaIds: { $exists: true } },
		projection: { mediaIds: true },
		batchSize: 100_000
	})) as { cursor?: { id?: unknown; firstBatch?: { mediaIds?: unknown }[] } };

	// A live cursor would mean silently missed references - and a missed
	// reference here means a deleted file. Refuse instead of guessing.
	const cursorId = response.cursor?.id ?? 0;
	const rawCursorId =
		typeof cursorId === 'object'
			? ((cursorId as { $numberLong?: string }).$numberLong ?? '')
			: String(cursorId);

	if (rawCursorId !== '' && rawCursorId !== '0') {
		throw new Error('[media-cleanup] legacy BlogArticle scan did not fit in a single batch');
	}

	return (response.cursor?.firstBatch ?? []).map((row) => ({
		mediaIds: Array.isArray(row.mediaIds) ? row.mediaIds.map(String) : []
	}));
}

/** Ids referenced anywhere in the database - the set that must never be deleted. */
export async function collectReferencedMediaIds(): Promise<Set<string>> {
	const rows = await Promise.all(MEDIA_OWNERS.map((query) => query()));

	return new Set(rows.flat().flatMap((row) => row.mediaIds ?? []));
}

/**
 * Deletes the given objects, skipping any that are still referenced by another
 * row (media can be shared between translations or between records).
 *
 * Never throws: a bucket failure must not roll back a successful db mutation.
 * Anything it fails to delete is picked up by the next `reconcileBucket` run.
 */
export async function cleanupMedia(candidateIds: readonly string[]): Promise<string[]> {
	const candidates = [...new Set(candidateIds.filter((id) => !isNil(id) && id !== ''))];

	if (candidates.length === 0) {
		return [];
	}

	const referenced = await collectReferencedMediaIds();
	const orphaned = candidates.filter((id) => !referenced.has(id));

	if (orphaned.length === 0) {
		return [];
	}

	const s3 = new S3Service();
	const results = await Promise.allSettled(orphaned.map((id) => s3.deleteFile(id)));

	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			console.error(`[media-cleanup] failed to delete "${orphaned[index]}"`, result.reason);
		}
	});

	return orphaned;
}

/** Ids that are about to disappear when `previous` is replaced by `next`. */
export function droppedMediaIds(previous: readonly string[], next: readonly string[]): string[] {
	return difference([...previous], [...next]);
}

export type ReconciliationReport = {
	bucketObjects: number;
	referenced: number;
	orphaned: number;
	deleted: string[];
	skippedWithinGracePeriod: number;
	/** Set when a sanity check refused to delete anything this run. */
	aborted?: string;
};

/**
 * Reconciliation sweep: list the bucket, subtract every `mediaIds` value found
 * in the database, delete what is left over as long as it is older than the
 * grace period (freshly uploaded files are not yet attached to a row).
 */
export async function reconcileBucket({
	gracePeriodMs = 24 * 60 * 60 * 1000,
	dryRun = false,
	now = Date.now()
}: {
	gracePeriodMs?: number;
	dryRun?: boolean;
	now?: number;
} = {}): Promise<ReconciliationReport> {
	const s3 = new S3Service();
	const [objects, referenced] = await Promise.all([
		s3.listAllObjects(),
		collectReferencedMediaIds()
	]);

	const orphaned = objects.filter((object) => !referenced.has(object.key));
	const deletable = orphaned.filter(
		(object) => now - (object.lastModified?.getTime() ?? 0) > gracePeriodMs
	);

	const report: ReconciliationReport = {
		bucketObjects: objects.length,
		referenced: referenced.size,
		orphaned: orphaned.length,
		deleted: deletable.map((object) => object.key),
		skippedWithinGracePeriod: orphaned.length - deletable.length
	};

	// Sanity guards - deletion is irreversible. Zero references next to a
	// non-empty bucket almost always means a broken or misconfigured database,
	// not a bucket full of garbage; and a sweep that wants to remove most of
	// the bucket at once warrants a human look first.
	const abortReason =
		referenced.size === 0 && objects.length > 0
			? 'database returned zero media references'
			: deletable.length > objects.length / 2
				? `sweep wanted to delete ${deletable.length} of ${objects.length} objects`
				: null;

	if (abortReason !== null) {
		console.error(`[media-cleanup] refusing to delete anything: ${abortReason}`);
		return { ...report, deleted: [], aborted: abortReason };
	}

	if (!dryRun && deletable.length > 0) {
		await s3.deleteFiles(deletable.map((object) => object.key));
	}

	return report;
}
