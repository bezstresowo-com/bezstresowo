import { Locale } from '$i18n';
import type { InternationalizedBioDto } from '$remote/dto/bio';

export type BioTranslationDraft = {
	enabled: boolean;
	/** TipTap HTML. */
	content: string;
	/** Media embedded in the content, keyed by id (mirrors the blog form). */
	media: Record<string, string>;
};

export type BioDraft = {
	/** One portrait shared by every language version; empty strings mean none. */
	imageId: string;
	imageUrl: string;
	translations: Record<Locale, BioTranslationDraft>;
};

export type ExistingBio = {
	imageId: string | null;
	imageUrl: string | null;
	internationalizedBios: { lang: string; content: string; mediaIds: string[] }[];
};

export function emptyBioDraft(): BioDraft {
	return {
		imageId: '',
		imageUrl: '',
		translations: Object.values(Locale).reduce(
			(acc, locale) => ({ ...acc, [locale]: { enabled: false, content: '', media: {} } }),
			{} as Record<Locale, BioTranslationDraft>
		)
	};
}

export function bioDraftFrom(bio: ExistingBio): BioDraft {
	const draft = emptyBioDraft();

	draft.imageId = bio.imageId ?? '';
	draft.imageUrl = bio.imageUrl ?? '';

	for (const translation of bio.internationalizedBios) {
		const locale = translation.lang as Locale;

		if (draft.translations[locale]) {
			draft.translations[locale] = {
				enabled: true,
				content: translation.content,
				media: Object.fromEntries(translation.mediaIds.map((id) => [id, id]))
			};
		}
	}

	return draft;
}

export type BioIssues = {
	translations?: string;
	contents?: Partial<Record<Locale, string>>;
};

/** Mirrors `UpsertBioDto`: at least one language, no empty contents. */
export function validateBioDraft(draft: BioDraft): BioIssues {
	const issues: BioIssues = {};

	const enabled = enabledBioLocales(draft);

	if (enabled.length === 0) {
		issues.translations = 'admin.languageTabs.atLeastOne';
	}

	const contents: Partial<Record<Locale, string>> = {};
	for (const locale of enabled) {
		if (isEmptyHtml(draft.translations[locale].content)) {
			contents[locale] = 'api.validation.errors.IsNotEmpty';
		}
	}

	if (Object.keys(contents).length > 0) {
		issues.contents = contents;
	}

	return issues;
}

/** An "empty" TipTap document still serializes to `<p></p>`. */
function isEmptyHtml(html: string): boolean {
	return html.replace(/<[^>]*>/g, '').trim().length === 0;
}

export function enabledBioLocales(draft: BioDraft): Locale[] {
	return Object.values(Locale).filter((locale) => draft.translations[locale].enabled);
}

export function toBioTranslationPayload(draft: BioDraft): InternationalizedBioDto[] {
	return enabledBioLocales(draft).map((locale) => ({
		lang: locale,
		content: draft.translations[locale].content,
		mediaIds: Object.keys(draft.translations[locale].media)
	}));
}
