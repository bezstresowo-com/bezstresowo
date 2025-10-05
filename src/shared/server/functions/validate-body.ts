import 'reflect-metadata';

import { HttpStatus } from '$shared/global/enums/http-status';
import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { json } from '@sveltejs/kit';

type ValidationResult<T> =
	| {
			type: 'error';
			response: Response;
	  }
	| {
			type: 'success';
			dto: T;
	  };

export async function validateRequestData<T extends object>(
	data: object,
	cls: ClassConstructor<T>
): Promise<ValidationResult<T>> {
	const dto = plainToInstance(cls, data);
	const errors = await validate(dto, {
		whitelist: true
	});

	if (errors.length > 0) {
		return {
			type: 'error',
			response: json(
				{
					errors: errors.map((err) => ({
						field: err.property,
						messages: Object.values(err.constraints ?? {})
					}))
				},
				{ status: HttpStatus.BAD_REQUEST }
			)
		};
	}

	return { type: 'success', dto };
}
