import 'reflect-metadata';

import { validators } from '$shared/server/validators';

const { IsDefined, IsEmail, IsString, IsUrl, MaxLength, MinLength } = validators;

export class UpdateSiteSettingsDto {
	@IsDefined()
	@IsString()
	@MinLength(5)
	@MaxLength(40)
	phone: string;

	@IsDefined()
	@IsEmail(undefined)
	@MaxLength(160)
	email: string;

	@IsDefined()
	@IsString()
	@MinLength(2)
	@MaxLength(120)
	locationPl: string;

	@IsDefined()
	@IsString()
	@MinLength(2)
	@MaxLength(120)
	locationUk: string;

	@IsDefined()
	@IsString()
	@MinLength(3)
	@MaxLength(80)
	hoursWeek: string;

	@IsDefined()
	@IsString()
	@MinLength(3)
	@MaxLength(80)
	hoursSaturday: string;

	@IsDefined()
	@IsUrl({ protocols: ['https'], require_protocol: true })
	@MaxLength(300)
	facebookUrl: string;

	@IsDefined()
	@IsUrl({ protocols: ['https'], require_protocol: true })
	@MaxLength(300)
	instagramPlUrl: string;

	@IsDefined()
	@IsUrl({ protocols: ['https'], require_protocol: true })
	@MaxLength(300)
	instagramUkUrl: string;

	@IsDefined()
	@IsUrl({ protocols: ['https'], require_protocol: true })
	@MaxLength(300)
	telegramUkUrl: string;
}
