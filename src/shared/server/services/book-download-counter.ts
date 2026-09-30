import { MAX_BOOK_DOWNLOADS } from './book-delivery';

export async function consumeBookDownload(
	store: {
		updateMany: (args: {
			where: { id: string; downloads: { lt: number } };
			data: { downloads: { increment: number } };
		}) => Promise<{ count: number }>;
	},
	sessionId: string
) {
	// Predicate and increment execute atomically in Mongo, including across server instances.
	const result = await store.updateMany({
		where: { id: sessionId, downloads: { lt: MAX_BOOK_DOWNLOADS } },
		data: { downloads: { increment: 1 } }
	});
	return result.count === 1;
}
