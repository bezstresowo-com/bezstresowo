// `@Type` reads design-time metadata while the class is being defined - the
// polyfill must be loaded first, also in the browser (admin forms import
// constants from this module).
import 'reflect-metadata';

import { Locale } from '$i18n';
import { SLUG_REGEX } from '$shared/global/functions/slug';
import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const {
	ArrayNotEmpty,
	IsArray,
	IsBoolean,
	IsDefined,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Min,
	MinLength,
	ValidateNested
} = validators;

/** The only currency the shop supports - amounts are always stored in grosze. */
export const PRODUCT_CURRENCY = 'PLN';

export const SITE_LOCATIONS = ['shop', 'registrations'] as const;
export type SiteLocation = (typeof SITE_LOCATIONS)[number];

const LOCALES = Object.values(Locale);

export class InternationalizedProductDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(250)
	name: string;

	/** Optional in practice - seeded products start with an empty description. */
	@IsDefined()
	@IsString()
	@MaxLength(5_000)
	description: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	mediaIds?: string[];
}

export class UpsertProductDto {
	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(120)
	@Matches(SLUG_REGEX)
	slug: string;

	@IsOptional()
	@IsBoolean()
	active?: boolean = true;

	/** May be empty: such a product shows up on the price list only. */
	@IsDefined()
	@IsArray()
	@IsIn(SITE_LOCATIONS, { each: true })
	siteLocations: SiteLocation[];

	@IsOptional()
	@IsString()
	@MaxLength(120)
	orderKey?: string;

	/** Always PLN, always an integer amount of grosze. */
	@IsDefined()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	priceInMinorUnits: number;

	@IsDefined()
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => InternationalizedProductDto)
	translations: InternationalizedProductDto[];
}

export class UpdateProductDto extends UpsertProductDto {
	@IsDefined()
	@IsString()
	id: string;
}

export class ProductIdDto {
	@IsDefined()
	@IsString()
	id: string;
}

export class ProductListParamsDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsOptional()
	@IsString()
	@IsIn(SITE_LOCATIONS)
	siteLocation?: SiteLocation;
}

export type LocalizedProduct = {
	id: string;
	slug: string;
	name: string;
	description: string;
	mediaIds: string[];
	imageUrls: string[];
	priceInMinorUnits: number;
	currency: string;
	siteLocations: string[];
	/** Product structured data, materialized on write - see `buildProductJsonLD`. */
	metadataJsonLD: unknown;
};
