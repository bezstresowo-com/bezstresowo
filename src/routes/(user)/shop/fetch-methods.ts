import type {
	CreateCheckoutSessionRequestDto,
	CreateCheckoutSessionResponseDto
} from '$api/stripe/(shop)/shop-checkout/model';
import { resolve } from '$app/paths';
import { HttpMethod } from '$shared/global/enums/http-method';
import { baseFetch } from '$shared/global/functions/base-fetch';
import { getBaseHeaders } from '$shared/global/functions/get-base-headers';

export async function getProducts() {
	return await baseFetch<any>(
		async () =>
			await fetch(`${resolve('/api/stripe/shop-products')}`, {
				method: HttpMethod.GET,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}

export async function createCheckoutSession(data: CreateCheckoutSessionRequestDto) {
	return await baseFetch<CreateCheckoutSessionResponseDto>(
		async () =>
			await fetch(`${resolve('/api/stripe/shop-checkout')}`, {
				method: HttpMethod.POST,
				headers: {
					...getBaseHeaders()
				},
				body: JSON.stringify(data)
			})
	);
}
