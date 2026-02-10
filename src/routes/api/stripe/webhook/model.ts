import type { ConsultationRegistrationCheckoutMetadata } from '../(registration)/registration-checkout/model';
import type { ShopCheckoutMetadata } from '../(shop)/shop-checkout/model';

export type StripeSessionMetadata =
	| ConsultationRegistrationCheckoutMetadata
	| ShopCheckoutMetadata
	| null;
