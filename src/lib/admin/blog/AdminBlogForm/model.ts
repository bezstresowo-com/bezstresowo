import { Locale } from '$i18n';
import {
	META_DESCRIPTION_MAX_LENGTH,
	META_TITLE_MAX_LENGTH,
	type InternationalizedBlogArticleDto
} from '$remote/dto/blog';
import { SLUG_REGEX } from '$shared/global/functions/slugify';

export { META_DESCRIPTION_MAX_LENGTH, META_TITLE_MAX_LENGTH };

/** One editable language version of an article. */
export type TranslationDraft = {
	enabled: boolean;
	slug: string;
	/** Set once the slug was edited by hand, so it stops following the title. */
	slugTouched: boolean;
	title: string;
	content: string;
	metaTitle: string;
	metaDescription: string;
	featuredImageId: string;
	featuredImageAlt: string;
	media: Record<string, string>;
};

export type TranslationDrafts = Record<Locale, TranslationDraft>;

export const LOCALE_TAB_LABELS: Record<Locale, string> = {
	[Locale.plPL]: 'admin.languageTabs.pl',
	[Locale.ukUA]: 'admin.languageTabs.uk'
};

export function emptyDraft(): TranslationDraft {
	return {
		enabled: false,
		slug: '',
		slugTouched: false,
		title: '',
		content: '',
		metaTitle: '',
		metaDescription: '',
		featuredImageId: '',
		featuredImageAlt: '',
		media: {}
	};
}

export function emptyDrafts(): TranslationDrafts {
	return Object.values(Locale).reduce(
		(acc, locale) => ({ ...acc, [locale]: emptyDraft() }),
		{} as TranslationDrafts
	);
}

export type ExistingTranslation = {
	lang: string;
	slug: string;
	title: string;
	content: string;
	metaTitle: string;
	metaDescription: string;
	featuredImageId: string | null;
	featuredImageAlt: string | null;
	mediaIds: string[];
};

export function draftsFrom(translations: ExistingTranslation[]): TranslationDrafts {
	const drafts = emptyDrafts();

	for (const translation of translations) {
		const locale = translation.lang as Locale;

		if (!drafts[locale]) {
			continue;
		}

		drafts[locale] = {
			enabled: true,
			slug: translation.slug,
			slugTouched: true,
			title: translation.title,
			content: translation.content,
			metaTitle: translation.metaTitle,
			metaDescription: translation.metaDescription,
			featuredImageId: translation.featuredImageId ?? '',
			featuredImageAlt: translation.featuredImageAlt ?? '',
			media: Object.fromEntries(translation.mediaIds.map((id) => [id, id]))
		};
	}

	return drafts;
}

export type DraftIssues = Partial<Record<keyof TranslationDraft, string>>;

/** Mirrors `InternationalizedBlogArticleDto`, so the server never sees garbage. */
export function validateDraft(draft: TranslationDraft): DraftIssues {
	const issues: DraftIssues = {};

	if (draft.title.trim().length === 0) {
		issues.title = 'api.validation.errors.IsNotEmpty';
	}

	if (draft.content.trim().length === 0) {
		issues.content = 'api.validation.errors.IsNotEmpty';
	}

	if (!SLUG_REGEX.test(draft.slug)) {
		issues.slug = 'api.validation.errors.Matches';
	}

	if (draft.metaTitle.trim().length === 0) {
		issues.metaTitle = 'api.validation.errors.IsNotEmpty';
	} else if (draft.metaTitle.length > META_TITLE_MAX_LENGTH) {
		issues.metaTitle = `api.validation.errors.MaxLength@${JSON.stringify({ length: META_TITLE_MAX_LENGTH })}`;
	}

	if (draft.metaDescription.trim().length === 0) {
		issues.metaDescription = 'api.validation.errors.IsNotEmpty';
	} else if (draft.metaDescription.length > META_DESCRIPTION_MAX_LENGTH) {
		issues.metaDescription = `api.validation.errors.MaxLength@${JSON.stringify({ length: META_DESCRIPTION_MAX_LENGTH })}`;
	}

	return issues;
}

export function toPayload(
	locale: Locale,
	draft: TranslationDraft
): InternationalizedBlogArticleDto {
	return {
		lang: locale,
		slug: draft.slug,
		title: draft.title.trim(),
		content: draft.content,
		metaTitle: draft.metaTitle.trim(),
		metaDescription: draft.metaDescription.trim(),
		featuredImageId: draft.featuredImageId || undefined,
		featuredImageAlt: draft.featuredImageAlt.trim() || undefined,
		mediaIds: Object.keys(draft.media)
	};
}
