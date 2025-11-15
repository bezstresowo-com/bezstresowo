import { PUBLIC_APP_HASH } from '$env/static/public';

export enum LocalStorageKey {
	locale = 'locale'
}

export function localStorageSetItem(key: LocalStorageKey, value: string) {
	localStorage.setItem(`${key}_${PUBLIC_APP_HASH}`, value);
}

export function localStorageGetItem(key: LocalStorageKey) {
	return localStorage.getItem(`${key}_${PUBLIC_APP_HASH}`);
}
