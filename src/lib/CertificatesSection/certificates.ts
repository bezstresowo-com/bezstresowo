import { asset } from '$app/paths';

export const CERTIFICATES = Array.from({ length: 8 }).map((_, i) =>
	asset(`/assets/certs/cert-${i}.jpg`)
);
