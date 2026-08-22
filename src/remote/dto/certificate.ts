// `@Type` reads design-time metadata while the class is being defined - the
// polyfill must be loaded first, also in the browser (admin forms import
// constants from this module).
import 'reflect-metadata';

import { Locale } from '$i18n';
import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const { ArrayNotEmpty, IsArray, IsDefined, IsIn, IsString, MaxLength, MinLength, ValidateNested } =
	validators;

const LOCALES = Object.values(Locale);

/** One localized alt text; empty texts are dropped on write. */
export class CertificateAltDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsDefined()
	@IsString()
	@MaxLength(250)
	text: string;
}

export class CreateCertificateDto {
	/** A bucket object key, uploaded through `admin-media.remote.ts` first. */
	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(250)
	imageId: string;

	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CertificateAltDto)
	alts: CertificateAltDto[];
}

/** Only the alt texts are editable - to change the image, delete and re-add. */
export class UpdateCertificateDto {
	@IsDefined()
	@IsString()
	id: string;

	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CertificateAltDto)
	alts: CertificateAltDto[];
}

export class CertificateIdDto {
	@IsDefined()
	@IsString()
	id: string;
}

/** The full gallery in its new order - every existing id exactly once. */
export class ReorderCertificatesDto {
	@IsDefined()
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	ids: string[];
}

export class CertificateListParamsDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;
}

export type LocalizedCertificate = {
	id: string;
	imageUrl: string;
	/** Alt in the requested language (default locale as fallback), may be empty. */
	alt: string;
};

export type AdminCertificate = {
	id: string;
	imageId: string;
	imageUrl: string;
	order: number;
	/** Keyed by locale - see `Certificate.altTexts` in the schema. */
	altTexts: Partial<Record<Locale, string>>;
};

/** `altTexts` is a Json column - narrow it to the map the app writes. */
export function toAltRecord(value: unknown): Partial<Record<Locale, string>> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? (value as Partial<Record<Locale, string>>)
		: {};
}
