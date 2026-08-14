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
	() => prisma.internationalizedProduct.findMany({ select: { mediaIds: true } })
] as const;

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

	if (!dryRun && deletable.length > 0) {
		await s3.deleteFiles(deletable.map((object) => object.key));
	}

	return {
		bucketObjects: objects.length,
		referenced: referenced.size,
		orphaned: orphaned.length,
		deleted: deletable.map((object) => object.key),
		skippedWithinGracePeriod: orphaned.length - deletable.length
	};
}
