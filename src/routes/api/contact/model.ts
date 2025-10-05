import { VALIDATION_ERRORS_TRANSLATION_PREFIX } from '$shared/server/consts';
import { IsDefined, IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactRequestDto {
	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsString({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsString` })
	@MinLength(1, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MinLength@${JSON.stringify({ length: 1 })}`
	})
	@MaxLength(100, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MaxLength@${JSON.stringify({ length: 100 })}`
	})
	name: string;

	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsString({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsString` })
	@MinLength(1, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MinLength@${JSON.stringify({ length: 1 })}`
	})
	@MaxLength(100, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MaxLength@${JSON.stringify({ length: 100 })}`
	})
	surname: string;

	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsString({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsString` })
	@IsPhoneNumber(undefined, { message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsPhoneNumber` })
	tel: string;

	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsEmail(undefined, { message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsEmail` })
	email: string;

	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsString({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsString` })
	@MinLength(10, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MinLength@${JSON.stringify({ length: 10 })}`
	})
	@MaxLength(150, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MaxLength@${JSON.stringify({ length: 150 })}`
	})
	subject: string;

	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsString({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsString` })
	@MinLength(10, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MinLength@${JSON.stringify({ length: 10 })}`
	})
	@MaxLength(10_000, {
		message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.MaxLength@${JSON.stringify({ length: 10_000 })}`
	})
	message: string;
}
