import { IsDefined, IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ContactRequestDto {
	@IsDefined()
	@IsString()
	@Length(1, 100)
	name: string;

	@IsDefined()
	@IsString()
	@Length(1, 100)
	surname: string;

	@IsDefined()
	@IsPhoneNumber(undefined, {message: 'api.contact.errors.tel'})
	tel: string;

	@IsDefined()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsString()
	@Length(10, 150)
	subject: string;

	@IsDefined()
	@IsString()
	@Length(100, 10000)
	message: string;
}
