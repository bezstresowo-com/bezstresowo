/**
 * Remote functions reject with the `App.Error` shape produced by
 * `error(...)` on the server, or by `handleValidationError` for invalid input.
 * Both carry a translation key in `message`.
 */
export type RemoteFailure = {
	message?: string;
	body?: { message?: string; issues?: { field: string; messages: string[] }[] };
	issues?: { field: string; messages: string[] }[];
};

export function remoteErrorMessage(error: unknown): string {
	if (typeof error !== 'object' || error === null) {
		return 'api.errors.general';
	}

	const failure = error as RemoteFailure;

	return failure.body?.message ?? failure.message ?? 'api.errors.general';
}

/** Field level validation issues, keyed by field name. */
export function remoteErrorIssues(error: unknown): Record<string, string[]> {
	if (typeof error !== 'object' || error === null) {
		return {};
	}

	const failure = error as RemoteFailure;
	const issues = failure.body?.issues ?? failure.issues ?? [];

	return Object.fromEntries(issues.map((issue) => [issue.field, issue.messages]));
}
