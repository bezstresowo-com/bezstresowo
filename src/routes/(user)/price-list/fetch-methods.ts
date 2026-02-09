import type { PriceListProducts } from '$api/stripe/price-list/model';
import { resolve } from '$app/paths';
import { HttpMethod } from '$shared/global/enums/http-method';
import { baseFetch } from '$shared/global/functions/base-fetch';
import { getBaseHeaders } from '$shared/global/functions/get-base-headers';

export async function getPriceListProducts() {
	return await baseFetch<PriceListProducts>(
		async () =>
			await fetch(`${resolve('/api/stripe/price-list')}`, {
				method: HttpMethod.GET,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}
