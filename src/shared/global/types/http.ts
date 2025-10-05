export interface HttpStatusResponse {
	status: 'ok';
}

export interface HttpErrorResponse {
	message: string;
}

export interface HttpValidationErrorResponse {
	errors: {
		field: string;
		messages: string[];
	}[];
}
