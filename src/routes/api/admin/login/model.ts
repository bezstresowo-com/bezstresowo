import { IsDefined, IsString } from 'class-validator';

export class LoginRequestDto {
	@IsDefined()
	@IsString()
	password: string;
}
