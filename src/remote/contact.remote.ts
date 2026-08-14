import { command, getRequestEvent } from '$app/server';
import { CONTACT_FORM_CAPTCHA_ENABLED } from '$shared/global/config/feature-flags';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { verifyCaptchaToken } from '$shared/server/functions/verify-captcha';
import { EmailService } from '$shared/server/services/email/email-service';
import { error } from '@sveltejs/kit';

import { ContactRequestDto, RegistrationRequestDto } from './dto/misc';

/** Notification emails go to the practice owner, who reads polish. */
const NO_MESSAGE = '<i>Brak wiadomości</i>';

export const sendContactRequest = command(dtoSchema(ContactRequestDto), async (dto) => {
	if (CONTACT_FORM_CAPTCHA_ENABLED) {
		const isHuman = await verifyCaptchaToken(dto.captchaToken, clientAddress());

		if (!isHuman) {
			error(HttpStatus.BAD_REQUEST, { message: 'api.contact.errors.captcha' });
		}
	}

	try {
		await new EmailService().contactRequestMessage(dto.lang, {
			email: dto.email,
			nameAndSurname: dto.nameAndSurname,
			tel: dto.tel,
			message: dto.message || NO_MESSAGE
		});
	} catch (cause) {
		console.error('[contact] failed to send the contact request', cause);
		error(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'api.contact.errors.general' });
	}
});

export const sendRegistrationRequest = command(dtoSchema(RegistrationRequestDto), async (dto) => {
	try {
		await new EmailService().consultationRegistrationMessage(dto.lang, {
			email: dto.email,
			nameAndSurname: dto.nameAndSurname,
			tel: dto.tel,
			therapyName: dto.therapyType,
			message: dto.message || NO_MESSAGE
		});
	} catch (cause) {
		console.error('[registrations] failed to send the registration request', cause);
		error(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'api.errors.INTERNAL_SERVER_ERROR' });
	}
});

/** Not every adapter can resolve the caller's address - the captcha works without it. */
function clientAddress(): string | undefined {
	try {
		return getRequestEvent().getClientAddress();
	} catch {
		return undefined;
	}
}
