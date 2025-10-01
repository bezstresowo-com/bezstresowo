import { VALIDATION_ERRORS_TRANSLATION_PREFIX } from '$shared/server/consts';
import { IsDefined, IsString } from 'class-validator';

export class LoginRequestDto {
	@IsDefined({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsDefined` })
	@IsString({ message: `${VALIDATION_ERRORS_TRANSLATION_PREFIX}.IsString` })
	password: string;
}
