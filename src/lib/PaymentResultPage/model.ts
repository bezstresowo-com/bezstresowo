import type { Translations } from '$i18n';

/** Both `checkoutMessages` sections (registrations / shop) carry this shape. */
export type PaymentResultLabels = Pick<
	Translations['user']['pages']['shop']['checkoutMessages'],
	'successTitle' | 'successDescription' | 'cancelTitle' | 'cancelDescription' | 'autoRedirect'
>;

export type Props = {
	type: 'success' | 'cancel';
	/** Result texts, e.g. `t.user.pages.shop.checkoutMessages`. */
	labels: PaymentResultLabels;
	/** Already resolved text of the back button. */
	buttonText: string;
	redirectPath: string;
	redirectDelay: number;
};
