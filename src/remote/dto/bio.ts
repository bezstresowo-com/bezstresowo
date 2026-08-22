// `@Type` reads design-time metadata while the class is being defined - the
// polyfill must be loaded first, also in the browser (admin forms import
// constants from this module).
import 'reflect-metadata';

import { Locale } from '$i18n';
import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const {
	ArrayNotEmpty,
	IsArray,
	IsDefined,
	IsIn,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested
} = validators;

const LOCALES = Object.values(Locale);

export class InternationalizedBioDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	/** TipTap HTML of the section body. */
	@IsDefined()
	@IsString()
	@MinLength(1)
	content: string;

	@IsDefined()
	@IsArray()
	@IsString({ each: true })
	mediaIds: string[];
}

/** The bio is a singleton - one upsert payload, no id. */
export class UpsertBioDto {
	/** One portrait shared by every language version - a bucket object key. */
	@IsOptional()
	@IsString()
	@MinLength(1)
	@MaxLength(250)
	imageId?: string;

	@IsDefined()
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => InternationalizedBioDto)
	translations: InternationalizedBioDto[];
}

export class BioParamsDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;
}

export type LocalizedBio = {
	/** The shared portrait, if any. */
	imageUrl: string | null;
	/** TipTap HTML in the requested language (default locale as fallback). */
	content: string;
};
