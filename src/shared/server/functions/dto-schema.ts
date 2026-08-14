import 'reflect-metadata';

import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';

import type { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Bridges the existing `class-validator` DTOs to the Standard Schema interface
 * that SvelteKit remote functions (`query` / `command` / `form`) validate with.
 *
 * Keeping the DTOs means the validation messages stay translation keys
 * (see `$shared/server/validators`) instead of raw english strings.
 */
export function dtoSchema<T extends object>(
	cls: ClassConstructor<T>
): StandardSchemaV1<unknown, T> {
	return {
		'~standard': {
			version: 1,
			vendor: 'class-validator',
			async validate(value) {
				const dto = plainToInstance(cls, value ?? {});
				const errors = await validate(dto, {
					whitelist: true,
					forbidUnknownValues: false
				});

				if (errors.length > 0) {
					return { issues: toIssues(errors) };
				}

				return { value: dto };
			}
		}
	};
}

/** Schema for remote functions that take no argument beyond a plain string id/slug. */
export function stringSchema(
	message = 'api.validation.errors.IsString'
): StandardSchemaV1<string, string> {
	return {
		'~standard': {
			version: 1,
			vendor: 'class-validator',
			validate(value) {
				if (typeof value !== 'string' || value.length === 0) {
					return { issues: [{ message, path: [] }] };
				}

				return { value };
			}
		}
	};
}

function toIssues(
	errors: ValidationError[],
	parentPath: PropertyKey[] = []
): StandardSchemaV1.Issue[] {
	return errors.flatMap((error) => {
		const path = [...parentPath, error.property];

		return [
			...Object.values(error.constraints ?? {}).map((message) => ({ message, path })),
			...toIssues(error.children ?? [], path)
		];
	});
}
