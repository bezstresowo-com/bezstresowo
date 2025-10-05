import 'reflect-metadata';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export interface HttpStatusResponse {
	status: 'ok';
}

export interface HttpErrorResponse {
	message: string;
}

export class PaginationParamsDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: 'Page must be an integer.' })
	@Min(1, { message: 'Page must be at least 1.' })
	page: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: 'Size must be an integer.' })
	@Min(1, { message: 'Size must be at least 1.' })
	size: number = 10;
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
