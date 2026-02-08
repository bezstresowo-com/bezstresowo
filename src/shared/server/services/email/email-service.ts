import { EMAIL_APP_PASSWORD, EMAIL_SENDER } from '$env/static/private';
import { htmlKeyValueReplacer } from '$shared/global/functions/html-key-value-replacer';
import { createTransport } from 'nodemailer';
import type { ContactRequestArgs, RegistrationRequestArgs } from './model';

export class EmailService {
	private readonly _transport;

	constructor() {
		this._transport = createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL_SENDER,
				pass: EMAIL_APP_PASSWORD
			}
		});
	}

	async contactRequest(args: ContactRequestArgs) {
		const ownerHtml = (await import('./email-templates/contact-request.html?raw')).default;
		const userHtml = (await import('./email-templates/contact-request-user.html?raw')).default;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`Nowa wiadomość od ${args.nameAndSurname}`,
			htmlKeyValueReplacer(ownerHtml, args)
		);

		// Send to user
		await this._send(
			args.email,
			'Dziękuję za wiadomość - bezstresowo.org',
			htmlKeyValueReplacer(userHtml, args)
		);
	}

	async registrationRequest(args: RegistrationRequestArgs) {
		const ownerHtml = (await import('./email-templates/registration-request.html?raw')).default;
		const userHtml = (await import('./email-templates/registration-request-user.html?raw')).default;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`Nowa rezerwacja od ${args.nameAndSurname}`,
			htmlKeyValueReplacer(ownerHtml, args)
		);

		// Send to user
		await this._send(
			args.email,
			'Potwierdzenie rezerwacji - bezstresowo.org',
			htmlKeyValueReplacer(userHtml, args)
		);
	}

	private async _send(to: string, subject: string, html: string) {
		await this._transport.sendMail({
			from: EMAIL_SENDER,
			to,
			subject,
			html
		});
	}
}
