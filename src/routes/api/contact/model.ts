import { validators } from '$shared/server/validators';

const { IsDefined, IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } = validators;

export class ContactRequestDto {
	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	name: string;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	surname: string;

	@IsDefined()
	@IsString()
	@IsPhoneNumber(undefined)
	tel: string;

	@IsDefined()
	@IsEmail(undefined)
	email: string;

	@IsDefined()
	@IsString()
	@MinLength(10)
	@MaxLength(150)
	subject: string;

	@IsDefined()
	@IsString()
	@MinLength(10)
	@MaxLength(10_000)
	message: string;
}
