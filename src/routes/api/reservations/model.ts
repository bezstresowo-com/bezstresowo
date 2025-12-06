import { IsDefined, IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ReservationsRequestDto {
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

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(250)
	checkInDate: string;
}
