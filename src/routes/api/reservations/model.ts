import { validators } from '$shared/server/validators';
import { THERAPY_TYPES, type TherapyType } from '$shared/global/types/therapy-types';

const {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDefined,
	IsEmail,
	IsIn,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested
} = validators;
import { Type } from 'class-transformer';

export { THERAPY_TYPES, type TherapyType };

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

export class ReservationsRequestDto {
	@IsDefined()
	@IsString()
	@IsIn(THERAPY_TYPES)
	therapyType: TherapyType;

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
}
