import { validators } from '$shared/server/validators';

const {
	IsDefined,
	IsString,
	IsOptional,
	MaxLength,
	IsEmail,
	IsPhoneNumber,
	MinLength,
	IsNotEmpty
} = validators;

export class RegistrationCheckoutRequestDto {
	@IsDefined()
	@IsString()
	priceId: string;

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	therapyName: string;

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

	@IsDefined()
	@IsString()
	successUrl: string;

	@IsDefined()
	@IsString()
	cancelUrl: string;
}

export interface RegistrationCheckoutResponseDto {
	sessionId: string;
	url: string | null;
}

export interface RegistrationCheckoutMetadata {
	type: 'registration';
	email: string;
	nameAndSurname: string;
	tel: string;
	therapyName: string;
	message: string;
}
