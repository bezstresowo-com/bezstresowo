import 'reflect-metadata';

import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const { IsInt, IsOptional, Min, IsIn } = validators;

export interface HttpStatusResponse {
	status: 'ok';
}

export interface HttpErrorResponse {
	message: string;
}

const ALLOWED_SORT_BY_VALUES = ['createdAt'] as const;
const ALLOWED_SORT_ORDER_VALUES = ['asc', 'desc'] as const;

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

	@IsOptional()
	@IsIn(ALLOWED_SORT_BY_VALUES)
	sortBy: (typeof ALLOWED_SORT_BY_VALUES)[number] = 'createdAt';

	@IsOptional()
	@IsIn(ALLOWED_SORT_ORDER_VALUES)
	sortOrder: (typeof ALLOWED_SORT_ORDER_VALUES)[number] = 'desc';
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
