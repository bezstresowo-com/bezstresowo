import { validators } from '$shared/server/validators';

const { IsDefined, IsString, IsNumber, IsOptional, Min } = validators;

export class CreateCheckoutSessionRequestDto {
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

export interface CreateCheckoutSessionResponseDto {
	sessionId: string;
	url: string | null;
	product: {
		id: string;
		name: string;
	};
}