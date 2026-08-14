import { Locale } from '$i18n';
import { validators } from '$shared/server/validators';
import { Type } from 'class-transformer';

const {
	IsDefined,
	IsEmail,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	Min,
	MinLength
} = validators;

const LOCALES = Object.values(Locale);

export class LoginDto {
	@IsDefined()
	@IsString()
	password: string;
}

export class ContactRequestDto {
	/** Language the visitor used on the site - their confirmation email follows it. */
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

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
	@MinLength(10)
	@MaxLength(10_000)
	message: string;

	/** Cloudflare Turnstile token - only checked when the captcha flag is on. */
	@IsOptional()
	@IsString()
	@MaxLength(4096)
	captchaToken?: string;
}

export class RegistrationRequestDto {
	/** Language the visitor used on the site - their confirmation email follows it. */
	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	therapyType: string;

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

	@IsOptional()
	@IsString()
	@MaxLength(500)
	message?: string;
}

/**
 * Checkout is created from a product that lives in our database - the client
 * only ever sends our own product id, never a Stripe price id.
 */
export class RegistrationCheckoutDto {
	@IsDefined()
	@IsString()
	productId: string;

	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	therapyName: string;

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

	@IsOptional()
	@IsString()
	@MaxLength(500)
	message?: string;
}

export class ShopCheckoutDto {
	@IsDefined()
	@IsString()
	productId: string;

	@IsDefined()
	@IsString()
	@IsIn(LOCALES)
	lang: Locale;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	quantity?: number = 1;
}

export class UploadMediaDto {
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsDefined()
	@IsString()
	@IsNotEmpty()
	mimeType: string;

	/** Base64 payload - remote function arguments are JSON, not multipart. */
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	dataBase64: string;
}

export class MediaIdDto {
	@IsDefined()
	@IsString()
	@IsNotEmpty()
	id: string;
}

export type CheckoutSession = {
	sessionId: string;
	url: string | null;
};
