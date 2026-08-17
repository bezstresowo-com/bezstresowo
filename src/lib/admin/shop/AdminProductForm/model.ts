import { Locale } from '$i18n';
import type { InternationalizedProductDto, SiteLocation } from '$remote/dto/product';
import { SLUG_REGEX } from '$shared/global/functions/slugify';

export type ProductTranslationDraft = {
	enabled: boolean;
	name: string;
	description: string;
};

export type ProductDraft = {
	slug: string;
	slugTouched: boolean;
	/** Entered in złoty, stored in grosze. */
	price: string;
	active: boolean;
	orderKey: string;
	siteLocations: SiteLocation[];
	translations: Record<Locale, ProductTranslationDraft>;
};

export type ExistingProduct = {
	id: string;
	slug: string;
	active: boolean;
	orderKey: string | null;
	siteLocations: string[];
	price: { inMinorUnits: number };
	internationalizedProducts: { lang: string; name: string; description: string }[];
};

export function emptyProductDraft(): ProductDraft {
	return {
		slug: '',
		slugTouched: false,
		price: '',
		active: true,
		orderKey: '',
		siteLocations: ['shop'],
		translations: Object.values(Locale).reduce(
			(acc, locale) => ({ ...acc, [locale]: { enabled: false, name: '', description: '' } }),
			{} as Record<Locale, ProductTranslationDraft>
		)
	};
}

export function productDraftFrom(product: ExistingProduct): ProductDraft {
	const draft = emptyProductDraft();

	draft.slug = product.slug;
	draft.slugTouched = true;
	draft.price = (product.price.inMinorUnits / 100).toFixed(2);
	draft.active = product.active;
	draft.orderKey = product.orderKey ?? '';
	draft.siteLocations = product.siteLocations as SiteLocation[];

	for (const translation of product.internationalizedProducts) {
		const locale = translation.lang as Locale;

		if (draft.translations[locale]) {
			draft.translations[locale] = {
				enabled: true,
				name: translation.name,
				description: translation.description
			};
		}
	}

	return draft;
}

/** `12,50` and `12.50` both mean 1250 grosze. */
export function toMinorUnits(price: string): number | null {
	const normalized = price.replace(',', '.').trim();

	if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
		return null;
	}

	return Math.round(Number(normalized) * 100);
}

export type ProductIssues = {
	slug?: string;
	price?: string;
	translations?: string;
	names?: Partial<Record<Locale, string>>;
};

/** Mirrors `UpsertProductDto`: empty `siteLocations` (price list only) and an
 * empty description are both allowed. */
export function validateProductDraft(draft: ProductDraft): ProductIssues {
	const issues: ProductIssues = {};

	if (!SLUG_REGEX.test(draft.slug)) {
		issues.slug = 'api.validation.errors.Matches';
	}

	if (toMinorUnits(draft.price) === null) {
		issues.price = 'api.validation.errors.IsNumber';
	}

	const enabled = enabledLocales(draft);

	if (enabled.length === 0) {
		issues.translations = 'admin.languageTabs.atLeastOne';
	}

	const names: Partial<Record<Locale, string>> = {};
	for (const locale of enabled) {
		const translation = draft.translations[locale];

		if (translation.name.trim().length === 0) {
			names[locale] = 'api.validation.errors.IsNotEmpty';
		}
	}

	if (Object.keys(names).length > 0) {
		issues.names = names;
	}

	return issues;
}

export function enabledLocales(draft: ProductDraft): Locale[] {
	return Object.values(Locale).filter((locale) => draft.translations[locale].enabled);
}

export function toTranslationPayload(draft: ProductDraft): InternationalizedProductDto[] {
	return enabledLocales(draft).map((locale) => ({
		lang: locale,
		name: draft.translations[locale].name.trim(),
		description: draft.translations[locale].description.trim()
	}));
}
