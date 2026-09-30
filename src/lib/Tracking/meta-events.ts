export const COOKIE_SETTINGS_EVENT = 'bezstresowo:cookie-settings';
export const META_PIXEL_EVENT = 'bezstresowo:meta-pixel-event';

export const META_STANDARD_EVENTS = ['Contact', 'Lead', 'Schedule'] as const;
export const META_CUSTOM_EVENTS = ['FreeMaterialOpen'] as const;

export type MetaStandardEvent = (typeof META_STANDARD_EVENTS)[number];
export type MetaCustomEvent = (typeof META_CUSTOM_EVENTS)[number];

export type MetaPixelEventDetail =
	| { command: 'track'; eventName: MetaStandardEvent }
	| { command: 'trackCustom'; eventName: MetaCustomEvent };

/**
 * The helpers deliberately accept no event parameters. This prevents form
 * values, service names or health-related information from being forwarded to
 * Meta by accident.
 */
export function trackMetaStandardEvent(eventName: MetaStandardEvent): void {
	dispatchMetaPixelEvent({ command: 'track', eventName });
}

export function trackMetaCustomEvent(eventName: MetaCustomEvent): void {
	dispatchMetaPixelEvent({ command: 'trackCustom', eventName });
}

export function openCookieSettings(): void {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}

export function isAllowedMetaPixelEvent(detail: unknown): detail is MetaPixelEventDetail {
	if (!detail || typeof detail !== 'object') return false;

	const candidate = detail as { command?: unknown; eventName?: unknown };

	if (candidate.command === 'track') {
		return META_STANDARD_EVENTS.includes(candidate.eventName as MetaStandardEvent);
	}

	if (candidate.command === 'trackCustom') {
		return META_CUSTOM_EVENTS.includes(candidate.eventName as MetaCustomEvent);
	}

	return false;
}

function dispatchMetaPixelEvent(detail: MetaPixelEventDetail): void {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(new CustomEvent<MetaPixelEventDetail>(META_PIXEL_EVENT, { detail }));
}
