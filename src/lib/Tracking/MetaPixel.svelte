<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { getLocale, Locale, path } from '$i18n';
	import { onMount } from 'svelte';
	import {
		COOKIE_SETTINGS_EVENT,
		isAllowedMetaPixelEvent,
		META_PIXEL_EVENT,
		type MetaPixelEventDetail
	} from './meta-events';

	const PIXEL_ID = '2269646353881533';
	const CONSENT_STORAGE_KEY = 'bezstresowo:marketing-consent:v1';

	type Consent = 'granted' | 'denied' | null;
	type Fbq = ((...args: unknown[]) => void) & {
		callMethod?: (...args: unknown[]) => void;
		queue?: unknown[][];
		push?: (...args: unknown[]) => void;
		loaded?: boolean;
		version?: string;
		__bezstresowoInitialized?: boolean;
	};
	type PixelWindow = Window & { fbq?: Fbq; _fbq?: Fbq };

	let consent = $state<Consent>(null);
	let ready = $state(false);
	let showBanner = $state(false);
	let lastTrackedUrl = $state<string | null>(null);

	const copy = $derived(
		getLocale() === Locale.ukUA
			? {
					title: 'Налаштування файлів cookie',
					body: 'Ми використовуємо необов’язкові файли cookie Meta, щоб вимірювати ефективність реклами. Вони запускаються лише після твоєї згоди. Ми не передаємо Meta дані з форм або інформацію про здоров’я.',
					accept: 'Прийняти',
					reject: 'Відхилити',
					privacy: 'Політика конфіденційності'
				}
			: {
					title: 'Ustawienia plików cookie',
					body: 'Używamy opcjonalnych plików cookie Meta do pomiaru skuteczności reklam. Uruchamiamy je wyłącznie po Twojej zgodzie. Nie przekazujemy Meta danych z formularzy ani informacji o zdrowiu.',
					accept: 'Akceptuję',
					reject: 'Odrzucam',
					privacy: 'Polityka prywatności'
				}
	);

	function getPixelWindow(): PixelWindow {
		return window as PixelWindow;
	}

	function ensureFbq(): Fbq {
		const pixelWindow = getPixelWindow();

		if (pixelWindow.fbq) {
			return pixelWindow.fbq;
		}

		const fbq = function (...args: unknown[]) {
			if (fbq.callMethod) {
				fbq.callMethod(...args);
			} else {
				fbq.queue?.push(args);
			}
		} as Fbq;

		fbq.queue = [];
		fbq.push = fbq;
		fbq.loaded = true;
		fbq.version = '2.0';
		pixelWindow.fbq = fbq;
		pixelWindow._fbq = fbq;

		const script = document.createElement('script');
		script.async = true;
		script.src = 'https://connect.facebook.net/en_US/fbevents.js';
		script.dataset.metaPixel = PIXEL_ID;
		document.head.appendChild(script);

		return fbq;
	}

	function initializePixel(): Fbq | null {
		if (!browser || consent !== 'granted') {
			return null;
		}

		// Stripe session IDs in the return URL must not reach Meta through the Pixel.
		if (window.location.pathname.endsWith('/registration-success') && window.location.search.includes('session_id=')) {
			return null;
		}

		const fbq = ensureFbq();
		if (!fbq.__bezstresowoInitialized) {
			fbq('init', PIXEL_ID);
			fbq.__bezstresowoInitialized = true;
		}

		return fbq;
	}

	function trackPageView() {
		if (!browser || consent !== 'granted') {
			return;
		}

		const currentUrl = `${window.location.pathname}${window.location.search}`;
		if (lastTrackedUrl === currentUrl) {
			return;
		}

		const fbq = initializePixel();
		if (fbq) {
			fbq('track', 'PageView');
			lastTrackedUrl = currentUrl;
		}
	}

	function persistConsent(value: Exclude<Consent, null>) {
		localStorage.setItem(CONSENT_STORAGE_KEY, value);
		consent = value;
		showBanner = false;
	}

	function accept() {
		persistConsent('granted');
		const fbq = initializePixel();
		fbq?.('consent', 'grant');
		trackPageView();
	}

	function reject() {
		const fbq = getPixelWindow().fbq;
		fbq?.('consent', 'revoke');
		persistConsent('denied');
		lastTrackedUrl = null;

		for (const cookie of ['_fbp', '_fbc']) {
			document.cookie = `${cookie}=; Max-Age=0; path=/; SameSite=Lax`;
		}
	}

	function openSettings() {
		showBanner = true;
	}

	function trackRequestedEvent(event: Event) {
		const detail = (event as CustomEvent<MetaPixelEventDetail>).detail;
		if (!isAllowedMetaPixelEvent(detail)) return;

		const fbq = initializePixel();
		fbq?.(detail.command, detail.eventName);
	}

	onMount(() => {
		const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
		consent = stored === 'granted' || stored === 'denied' ? stored : null;
		showBanner = consent === null;
		ready = true;

		if (consent === 'granted') {
			trackPageView();
		}

		window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
		window.addEventListener(META_PIXEL_EVENT, trackRequestedEvent);
		return () => {
			window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
			window.removeEventListener(META_PIXEL_EVENT, trackRequestedEvent);
		};
	});

	afterNavigate(() => {
		if (ready && consent === 'granted') {
			trackPageView();
		}
	});
</script>

{#if ready && showBanner}
	<div
		class="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
		role="dialog"
		aria-live="polite"
		aria-label={copy.title}
	>
		<div
			class="mx-auto max-w-4xl rounded-2xl border border-primary/15 bg-background p-5 shadow-2xl sm:p-6"
		>
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="max-w-2xl">
					<h2 class="mb-2 text-lg font-semibold text-primary">{copy.title}</h2>
					<p class="text-sm leading-6 text-primary/80">{copy.body}</p>
					<a
						class="mt-2 inline-block text-sm font-medium text-primary underline underline-offset-2"
						href={path('/gdpr')}
					>
						{copy.privacy}
					</a>
				</div>
				<div class="flex shrink-0 flex-col gap-2 sm:flex-row">
					<button
						type="button"
						onclick={reject}
						class="h-11 rounded-lg border border-primary/25 bg-white px-5 font-medium text-primary transition hover:bg-primary/5"
					>
						{copy.reject}
					</button>
					<button
						type="button"
						onclick={accept}
						class="h-11 rounded-lg bg-accent px-5 font-medium text-primary transition hover:bg-accent/80"
					>
						{copy.accept}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
