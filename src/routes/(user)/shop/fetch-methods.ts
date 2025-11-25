import { resolve } from "$app/paths";
import { HttpMethod } from "$shared/global/enums/http-method";
import { baseFetch } from "$shared/global/functions/base-fetch";
import { getBaseHeaders } from "$shared/global/functions/get-base-headers";


	export async function getProducts() {
	return await baseFetch<any>(
		async () =>
			await fetch(`${resolve('/api/stripe-webhook')}`, {
				method: HttpMethod.GET,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}
