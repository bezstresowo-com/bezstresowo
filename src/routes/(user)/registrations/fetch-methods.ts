import type {
	RegistrationCheckoutRequestDto,
	RegistrationCheckoutResponseDto
} from '$api/stripe/(registration)/registration-checkout/model';
import type { RegistrationProduct } from '$api/stripe/(registration)/registration-products/model';
import { resolve } from '$app/paths';
import { HttpMethod } from '$shared/global/enums/http-method';
import { baseFetch } from '$shared/global/functions/base-fetch';
import { getBaseHeaders } from '$shared/global/functions/get-base-headers';

export async function getRegistrationProducts() {
	return await baseFetch<{ data: RegistrationProduct[] }>(
		async () =>
			await fetch(`${resolve('/api/stripe/registration-products')}`, {
				method: HttpMethod.GET,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}

export async function createRegistrationCheckout(data: RegistrationCheckoutRequestDto) {
	return await baseFetch<RegistrationCheckoutResponseDto>(
		async () =>
			await fetch(`${resolve('/api/stripe/registration-checkout')}`, {
				method: HttpMethod.POST,
				headers: {
					...getBaseHeaders()
				},
				body: JSON.stringify(data)
			})
	);
}
