import { validators } from '$shared/server/validators';

const { IsDefined, IsString } = validators;

export class LoginRequestDto {
	@IsDefined()
	@IsString()
	password: string;
}
