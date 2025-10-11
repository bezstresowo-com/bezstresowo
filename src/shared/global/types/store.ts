export interface LoadableState<T> {
	data: T | null;
	error: string | null;
	isLoading: boolean;
}

export const DEFAULT_LOADABLE_STATE = {
	data: null,
	error: null,
	isLoading: false
} satisfies LoadableState<unknown>;

export const LOADING = {
	error: null,
	isLoading: true
} satisfies Omit<LoadableState<unknown>, 'data'>;

export const LOADED = {
	error: null,
	isLoading: false
} satisfies Omit<LoadableState<unknown>, 'data'>;

export const ERRORED = (error: LoadableState<unknown>['error']) =>
	({
		error,
		isLoading: false
	}) satisfies Omit<LoadableState<unknown>, 'data'>;
