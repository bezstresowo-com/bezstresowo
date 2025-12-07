import {
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
} from 'class-validator';
import { Type } from 'class-transformer';

export const THERAPY_TYPES = ['individual', 'couples', 'group', 'other'] as const;
export type TherapyType = (typeof THERAPY_TYPES)[number];

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
