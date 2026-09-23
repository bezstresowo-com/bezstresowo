import { command, getRequestEvent } from '$app/server';
import { HttpStatus } from '$shared/global/enums/http-status';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { createRateLimiter } from '$shared/server/functions/rate-limit';
import { EmailService } from '$shared/server/services/email/email-service';
import { error } from '@sveltejs/kit';

import { GroupApplicationDto } from './dto/misc';

const applicationAttempts = createRateLimiter({ max: 5, windowMs: 60 * 60 * 1000 });

export const sendGroupApplication = command(dtoSchema(GroupApplicationDto), async (dto) => {
	if (!applicationAttempts.consume(clientAddress())) {
		error(HttpStatus.TOO_MANY_REQUESTS, {
			message: 'Забагато спроб. Спробуй надіслати анкету пізніше.'
		});
	}

	try {
		await new EmailService().groupApplicationMessage(dto);
	} catch (cause) {
		console.error('[group-application] failed to send the application', cause);
		error(HttpStatus.INTERNAL_SERVER_ERROR, {
			message: 'Не вдалося надіслати анкету. Спробуй ще раз.'
		});
	}
});

function clientAddress(): string {
	try {
		return getRequestEvent().getClientAddress();
	} catch {
		return 'unknown';
	}
}
