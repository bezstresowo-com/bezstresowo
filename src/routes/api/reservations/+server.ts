import { EMAIL_SENDER } from '$env/static/private';
import { HttpStatus } from '$shared/global/enums/http-status';
import { buildErrorResponse, buildOkResponse } from '$shared/server/functions/build-response';
import { validateRequest } from '$shared/server/functions/validate-body';
import { EmailService } from '$shared/server/services/email/email-service';

import { ReservationsRequestDto } from './model';

export async function POST({ request, route }) {
	try {
		const validationResult = await validateRequest(await request.json(), ReservationsRequestDto);
		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { therapyType, preferredDates, nameAndSurname, tel, email, message } =
			validationResult.dto;

		const msg = message ?? '';

		await new EmailService(EMAIL_SENDER, `New reservation request from ${nameAndSurname}`, [
			email
		]).reservationRequest({
			email,
			message: msg,
			nameAndSurname,
			tel,
			therapyType,
			preferredDates
		});

		return buildOkResponse();
	} catch {
		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
