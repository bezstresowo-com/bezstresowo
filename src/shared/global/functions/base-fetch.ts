import { HttpStatus } from '../enums/http-status';
import type { HttpErrorResponse, HttpValidationErrorResponse } from '../types/http';

type FetchResult<T> =
	| {
			status: 'ok';
			data: T;
	  }
	| {
			status: 'error';
			data: HttpErrorResponse;
	  }
	| {
			status: 'validationError';
			data: HttpValidationErrorResponse;
			error: 'api.generalError';
	  }
	| {
			status: 'unknown';
			data: any;
			error: 'api.generalError';
	  };

export async function baseFetch<T>(fetchFn: () => Promise<Response>): Promise<FetchResult<T>> {
	try {
		const response = await fetchFn();

		const resBody = await response.json();
		switch (response.status) {
			case HttpStatus.OK:
				return {
					status: 'ok',
					data: resBody as T
				};

			case HttpStatus.INTERNAL_SERVER_ERROR:
			case HttpStatus.UNAUTHORIZED:
				return {
					status: 'error',
					data: resBody as HttpErrorResponse
				};

			case HttpStatus.BAD_REQUEST:
				return {
					status: 'validationError',
					data: resBody as HttpValidationErrorResponse,
					error: 'api.generalError'
				};

			default: {
				return {
					status: 'unknown',
					data: resBody,
					error: 'api.generalError'
				};
			}
		}
	} catch (error) {
		console.error(error);
		return {
			status: 'unknown',
			data: null,
			error: 'api.generalError'
		};
	}
}
