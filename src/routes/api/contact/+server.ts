import { EMAIL_SENDER } from '$env/static/private';
import { HttpStatus } from '$shared/enums/http-status';
import { validateBody } from '$shared/server/functions/validate-body';
import { EmailService } from '$shared/server/services/email-service/email-service';

import { json } from '@sveltejs/kit';

import { ContactRequestDto } from './model';

import type { HttpErrorResponse, HttpStatusResponse } from '$shared/types/http';

export async function POST({ request }) {
	const validationResult = await validateBody(await request.json(), ContactRequestDto);
	if (validationResult.type === 'error') {
		return validationResult.response;
	}

	const { email, message, name, surname, subject, tel } = validationResult.dto;

	try {
		await new EmailService(EMAIL_SENDER, `New contact request from ${name} ${surname}`, [
			email
		]).contactRequest({
			email,
			message,
			name,
			surname,
			subject,
			tel
		});
	} catch {
		return json({ message: 'api.contact.errors.general' } satisfies HttpErrorResponse, {
			status: HttpStatus.INTERNAL_SERVER_ERROR
		});
	}

	return json({ status: 'ok' } satisfies HttpStatusResponse, { status: HttpStatus.OK });
}
