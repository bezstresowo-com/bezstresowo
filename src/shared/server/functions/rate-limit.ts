type Bucket = { count: number; resetAt: number };

/**
 * Fixed-window in-memory rate limiter. On serverless the map lives per warm
 * instance, so the cap is not an exact global limit - but it is enough to
 * blunt brute force attempts and CPU amplification.
 */
export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
	const buckets = new Map<string, Bucket>();

	function prune(now: number) {
		if (buckets.size < 1000) {
			return;
		}

		for (const [key, bucket] of buckets) {
			if (bucket.resetAt <= now) {
				buckets.delete(key);
			}
		}
	}

	return {
		/** Registers an attempt; `false` means the key is over its budget. */
		consume(key: string): boolean {
			const now = Date.now();
			prune(now);

			const bucket = buckets.get(key);

			if (!bucket || bucket.resetAt <= now) {
				buckets.set(key, { count: 1, resetAt: now + windowMs });
				return true;
			}

			bucket.count += 1;
			return bucket.count <= max;
		}
	};
}
