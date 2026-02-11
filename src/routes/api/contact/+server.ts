import { HttpStatus } from '$shared/global/enums/http-status';
import { buildErrorResponse, buildOkResponse } from '$shared/server/functions/build-response';
import { validateRequest } from '$shared/server/functions/validate-body';
import { EmailService } from '$shared/server/services/email/email-service';

import { ContactRequestDto } from './model';

export async function POST({ request, route }) {
	try {
		const validationResult = await validateRequest(await request.json(), ContactRequestDto);
		if (validationResult.type === 'error') {
			return validationResult.response;
		}

		const { email, message, nameAndSurname, tel } = validationResult.dto;

		await new EmailService().contactRequestMessage({
			email,
			message: message || '<i>Brak wiadomości</i>',
			nameAndSurname,
			tel
		});

		return buildOkResponse();
	} catch {
		return buildErrorResponse(route, request, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
