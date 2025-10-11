import 'reflect-metadata';

import { Type } from 'class-transformer';
import { validators } from '$shared/server/validators';

const { IsInt, IsOptional, Min } = validators;

export interface HttpStatusResponse {
	status: 'ok';
}

export interface HttpErrorResponse {
	message: string;
}

export class PaginationParamsDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	size: number = 25;
}

export interface PaginatedDataResponseDto<T> {
	data: T[];
	page: number;
	size: number;
}

export interface HttpValidationErrorResponse {
	errors: {
		field: string;
		messages: string[];
	}[];
}
