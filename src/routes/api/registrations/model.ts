import { validators } from '$shared/server/validators';

const {
	IsDefined,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength
} = validators;

export class PreferredDateDto {
	@IsDefined()
	@IsString()
	date: string;

	@IsDefined()
	@IsString()
	timeFrom: string;

	@IsDefined()
	@IsString()
	timeTo: string;
}

export class RegistrationsRequestDto {
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	therapyType: string;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(250)
	nameAndSurname: string;

	@IsDefined()
	@IsString()
	@IsPhoneNumber(undefined)
	tel: string;

	@IsDefined()
	@IsEmail(undefined)
	email: string;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	message?: string;
}
