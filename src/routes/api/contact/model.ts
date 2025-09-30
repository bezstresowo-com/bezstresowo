import { IsDefined, IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactRequestDto {
	@IsDefined({ message: 'api.validation.errors.IsDefined' })
	@IsString({ message: 'api.validation.errors.IsString' })
	@MinLength(1, { message: 'api.validation.errors.MinLength@{"length":1}' })
	@MaxLength(100, { message: 'api.validation.errors.MaxLength@{"length":100}' })
	name: string;

	@IsDefined({ message: 'api.validation.errors.IsDefined' })
	@IsString({ message: 'api.validation.errors.IsString' })
	@MinLength(1, { message: 'api.validation.errors.MinLength@{"length":1}' })
	@MaxLength(100, { message: 'api.validation.errors.MaxLength@{"length":100}' })
	surname: string;

	@IsDefined({ message: 'api.validation.errors.IsDefined' })
	@IsString({ message: 'api.validation.errors.IsString' })
	@IsPhoneNumber(undefined, { message: 'api.validation.errors.IsPhoneNumber' })
	tel: string;

	@IsDefined({ message: 'api.validation.errors.IsDefined' })
	@IsEmail(undefined, { message: 'api.validation.errors.IsEmail' })
	email: string;

	@IsDefined({ message: 'api.validation.errors.IsDefined' })
	@IsString({ message: 'api.validation.errors.IsString' })
	@MinLength(10, { message: 'api.validation.errors.MinLength@{"length":10}' })
	@MaxLength(150, { message: 'api.validation.errors.MaxLength@{"length":150}' })
	subject: string;

	@IsDefined({ message: 'api.validation.errors.IsDefined' })
	@IsString({ message: 'api.validation.errors.IsString' })
	@MinLength(10, { message: 'api.validation.errors.MinLength@{"length":10}' })
	@MaxLength(10_000, { message: 'api.validation.errors.MaxLength@{"length":10000}' })
	message: string;
}
