import { Locale } from '$i18n';
import { SLUG_REGEX } from '$shared/global/functions/slugify';
import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const {
	ArrayNotEmpty,
	IsArray,
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

export const META_TITLE_MAX_LENGTH = 60;
export const META_DESCRIPTION_MAX_LENGTH = 155;

const LOCALES = Object.values(Locale);

export class InternationalizedBlogArticleDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(120)
	@Matches(SLUG_REGEX)
	slug: string;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(250)
	title: string;

	@IsDefined()
	@IsString()
	@MinLength(1)
	content: string;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(META_TITLE_MAX_LENGTH)
	metaTitle: string;

	@IsDefined()
	@IsString()
	@MinLength(1)
	@MaxLength(META_DESCRIPTION_MAX_LENGTH)
	metaDescription: string;

	@IsOptional()
	@IsString()
	featuredImageId?: string;

	@IsOptional()
	@IsString()
	@MaxLength(250)
	featuredImageAlt?: string;

	@IsDefined()
	@IsArray()
	@IsString({ each: true })
	mediaIds: string[];
}

/** An article needs at least one language version, but never both. */
export class UpsertBlogArticleDto {
	@IsDefined()
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => InternationalizedBlogArticleDto)
	translations: InternationalizedBlogArticleDto[];
}

export class UpdateBlogArticleDto extends UpsertBlogArticleDto {
	@IsDefined()
	@IsString()
	id: string;
}

export class BlogArticleIdDto {
	@IsDefined()
	@IsString()
	id: string;
}

export class BlogArticleListParamsDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	size: number = 25;
}

export class BlogArticleBySlugDto {
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsDefined()
	@IsString()
	@MinLength(1)
	slug: string;
}

export type BlogArticleListItem = {
	id: string;
	slug: string;
	title: string;
	metaDescription: string;
	featuredImageId: string | null;
	featuredImageUrl: string | null;
	featuredImageAlt: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type BlogArticleDetails = BlogArticleListItem & {
	content: string;
	metaTitle: string;
	metadataJsonLD: unknown;
	/** Slugs of the other language versions, used to build `hreflang` links. */
	alternates: { lang: Locale; slug: string }[];
};
