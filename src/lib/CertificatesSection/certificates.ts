import { asset } from '$app/paths';

export const CERTIFICATES = Array.from({ length: 17 }).map((_, i) =>
	asset(`/assets/certs/cert-${i}.jpg`)
);
