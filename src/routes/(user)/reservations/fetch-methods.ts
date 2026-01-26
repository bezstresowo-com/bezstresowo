import type {
	ReservationCheckoutRequestDto,
	ReservationCheckoutResponseDto
} from '$api/stripe/(reservation)/reservation-checkout/model';
import type { ReservationProduct } from '$api/stripe/(reservation)/reservation-products/model';
import { resolve } from '$app/paths';
import { HttpMethod } from '$shared/global/enums/http-method';
import { baseFetch } from '$shared/global/functions/base-fetch';
import { getBaseHeaders } from '$shared/global/functions/get-base-headers';

export async function getReservationProducts() {
	return await baseFetch<{ data: ReservationProduct[] }>(
		async () =>
			await fetch(`${resolve('/api/stripe/reservation-products')}`, {
				method: HttpMethod.GET,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}

export async function createReservationCheckout(data: ReservationCheckoutRequestDto) {
	return await baseFetch<ReservationCheckoutResponseDto>(
		async () =>
			await fetch(`${resolve('/api/stripe/reservation-checkout')}`, {
				method: HttpMethod.POST,
				headers: {
					...getBaseHeaders()
				},
				body: JSON.stringify(data)
			})
	);
}
