import { command } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { EmailService } from '$shared/server/services/email/email-service';
import { error } from '@sveltejs/kit';

import { ContactRequestDto, RegistrationRequestDto } from './dto/misc';

/** Notification emails go to the practice owner, who reads polish. */
const NO_MESSAGE = '<i>Brak wiadomości</i>';

export const sendContactRequest = command(dtoSchema(ContactRequestDto), async (dto) => {
	try {
		await new EmailService().contactRequestMessage({
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
		await new EmailService().consultationRegistrationMessage({
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
