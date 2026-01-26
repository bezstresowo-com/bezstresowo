import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const {
	IsDefined,
	IsString,
	IsArray,
	ArrayMinSize,
	ArrayMaxSize,
	ValidateNested,
	IsOptional,
	MaxLength,
	IsEmail,
	IsPhoneNumber,
	MinLength,
	IsNotEmpty
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

export class ReservationCheckoutRequestDto {
	@IsDefined()
	@IsString()
	priceId: string;

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	therapyName: string;

	@IsDefined()
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@ValidateNested({ each: true })
	@Type(() => PreferredDateDto)
	preferredDates: PreferredDateDto[];

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

export interface ReservationCheckoutResponseDto {
	sessionId: string;
	url: string | null;
}

export interface ReservationCheckoutMetadata {
	type: 'reservation';
	email: string;
	nameAndSurname: string;
	tel: string;
	therapyName: string;
	preferredDates: string;
	message: string;
}
