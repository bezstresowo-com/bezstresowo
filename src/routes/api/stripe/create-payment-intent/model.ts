import { validators } from '$shared/server/validators';

const { IsDefined, IsString, IsNumber, IsOptional, Min } = validators;

export class CreatePaymentIntentRequestDto {
	@IsDefined()
	@IsString()
	priceId: string;

	@IsOptional()
	@IsNumber()
	@Min(1)
	quantity?: number;
}

export interface CreatePaymentIntentResponseDto {
	clientSecret: string;
	paymentIntentId: string;
	amount: number;
	currency: string;
	product: {
		id: string;
		name: string;
	};
}
