export interface ConsultationRegistrationCheckoutMetadata {
	type: 'consultation-registration';
	email: string;
	nameAndSurname: string;
	tel: string;
	therapyName: string;
	message: string;
}

export interface ShopCheckoutMetadata {
	type: 'shop';
	productId: string;
	/** Products only exist in our database, so the name travels in the metadata. */
	productName: string;
}

export type StripeSessionMetadata =
	| ConsultationRegistrationCheckoutMetadata
	| ShopCheckoutMetadata
	| null;
