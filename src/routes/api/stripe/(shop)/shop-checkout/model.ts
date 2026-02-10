import { validators } from '$shared/server/validators';

const { IsDefined, IsString, IsNumber, IsOptional, Min } = validators;

export class ShopCheckoutRequestDto {
	@IsDefined()
	@IsString()
	priceId: string;

	@IsOptional()
	@IsNumber()
	@Min(1)
	quantity?: number;

	@IsDefined()
	@IsString()
	successUrl: string;

	@IsDefined()
	@IsString()
	cancelUrl: string;
}

export interface ShopCheckoutResponseDto {
	sessionId: string;
	url: string | null;
	product: {
		id: string;
		name: string;
	};
}

export interface ShopCheckoutMetadata {
	type: 'shop';
}
