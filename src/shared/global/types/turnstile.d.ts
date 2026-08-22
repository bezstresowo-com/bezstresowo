/** Minimal typings for the Cloudflare Turnstile widget (loaded on demand). */
interface TurnstileRenderOptions {
	sitekey: string;
	language?: string;
	callback?: (token: string) => void;
	'expired-callback'?: () => void;
	'error-callback'?: () => void;
}

interface Turnstile {
	render(container: HTMLElement, options: TurnstileRenderOptions): string;
	reset(widgetId?: string): void;
	remove(widgetId: string): void;
}

interface Window {
	turnstile?: Turnstile;
}
