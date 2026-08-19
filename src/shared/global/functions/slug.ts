/**
 * Slugs are lowercase, hyphenated, ascii-only and written in english - one per
 * article (shared by every language version) and one per product. They are
 * entered by hand in the panel; this regex guards them in the DTOs and forms.
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
