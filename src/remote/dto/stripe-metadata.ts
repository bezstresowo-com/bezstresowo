export interface ConsultationRegistrationCheckoutMetadata {
	type: 'consultation-registration';
	/** Locale prefix (`pl` / `uk`) - the confirmation email follows this language. */
	lang: string;
	email: string;
	nameAndSurname: string;
	tel: string;
	therapyName: string;
	message: string;
}

export interface ShopCheckoutMetadata {
	type: 'shop';
	/** Locale prefix (`pl` / `uk`) - the confirmation email follows this language. */
	lang: string;
	productId: string;
	/** Products only exist in our database, so the name travels in the metadata. */
	productName: string;
}

export type StripeSessionMetadata =
	| ConsultationRegistrationCheckoutMetadata
	| ShopCheckoutMetadata
	| null;
