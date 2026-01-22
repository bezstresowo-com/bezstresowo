import type {
	CreateCheckoutSessionRequestDto,
	CreateCheckoutSessionResponseDto
} from '$api/stripe/create-checkout-session/model';
import { resolve } from '$app/paths';
import { HttpMethod } from '$shared/global/enums/http-method';
import { baseFetch } from '$shared/global/functions/base-fetch';
import { getBaseHeaders } from '$shared/global/functions/get-base-headers';

export async function getProducts() {
	return await baseFetch<any>(
		async () =>
			await fetch(`${resolve('/api/stripe/products')}`, {
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
			await fetch(`${resolve('/api/stripe/create-checkout-session')}`, {
				method: HttpMethod.POST,
				headers: {
					...getBaseHeaders(),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	);
}
