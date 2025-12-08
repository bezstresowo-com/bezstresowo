import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { htmlKeyValueReplacer } from '$shared/global/functions/html-key-value-replacer';
import { createTransport } from 'nodemailer';
import type { ContactRequestArgs, ReservationRequestArgs } from './model';

export class EmailService {
	private readonly _transport;

	constructor(
		private readonly _reciever: string,
		private readonly _subject: string,
		private readonly _cc?: string[]
	) {
		this._transport = createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL_SENDER,
				pass: EMAIL_APP_PASSWORD
			}
		});
	}

	async contactRequest(args: ContactRequestArgs) {
		const html = (await import('./email-templates/contact-request.html?raw')).default;
		const replacedHtml = htmlKeyValueReplacer(html, args);
		await this._send(replacedHtml);
	}

	async reservationRequest(args: ReservationRequestArgs) {
		const html = (await import('./email-templates/reservation-request.html?raw')).default;

		const formattedArgs = {
			...args,
			preferredDates: args.preferredDates
				.map((d, i) => `${i + 1}. ${d.date} (${d.timeFrom} - ${d.timeTo})`)
				.join('<br>')
		};

		const replacedHtml = htmlKeyValueReplacer(html, formattedArgs);
		await this._send(replacedHtml);
	}

	private async _send(html: string) {
		await this._transport.sendMail({
			from: EMAIL_SENDER,
			to: this._reciever,
			cc: this._cc,
			subject: `${EMAIL_SUBJECT_PREFIX} ${this._subject}`,
			html
		});
	}
}
