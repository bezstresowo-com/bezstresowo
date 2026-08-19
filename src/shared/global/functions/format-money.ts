import type { Locale } from '$i18n';

/**
 * Amounts are stored as integers in minor units (grosze); the currency is
 * always PLN, but the formatting follows the language of the page.
 */
export function formatMoney(inMinorUnits: number, currency: string, locale: Locale): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(inMinorUnits / 100);
}
