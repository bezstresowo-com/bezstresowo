import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { json } from '@sveltejs/kit';
import { HttpStatus } from '$shared/enums/http-status';

type ValidationResult<T> =
	| {
			type: 'error';
			response: Response;
	  }
	| {
			type: 'success';
			dto: T;
	  };

export async function validateBody<T extends object>(
	body: object,
	cls: ClassConstructor<T>
): Promise<ValidationResult<T>> {
	const dto = plainToInstance(cls, body);
	const errors = await validate(dto);

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
