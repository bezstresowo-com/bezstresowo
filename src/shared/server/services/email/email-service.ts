import { EMAIL_APP_PASSWORD, EMAIL_SENDER } from '$env/static/private';
import { htmlKeyValueReplacer } from '$shared/global/functions/html-key-value-replacer';
import { createTransport } from 'nodemailer';
import type { ContactRequestArgs, ReservationRequestArgs } from './model';

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
			'Dziękuję za wiadomość - bezstresowo.com',
			htmlKeyValueReplacer(userHtml, args)
		);
	}

	async reservationRequest(args: ReservationRequestArgs) {
		const ownerHtml = (await import('./email-templates/reservation-request.html?raw')).default;
		const userHtml = (await import('./email-templates/reservation-request-user.html?raw')).default;

		const formattedArgs = {
			...args,
			preferredDates: args.preferredDates
				.map((d, i) => `${i + 1}. ${d.date} (${d.timeFrom} - ${d.timeTo})`)
				.join('<br>')
		};

		console.log(JSON.stringify({ args, formattedArgs }));

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`Nowa rezerwacja od ${args.nameAndSurname}`,
			htmlKeyValueReplacer(ownerHtml, formattedArgs)
		);

		// Send to user
		await this._send(
			args.email,
			'Potwierdzenie rezerwacji - bezstresowo.com',
			htmlKeyValueReplacer(userHtml, formattedArgs)
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
