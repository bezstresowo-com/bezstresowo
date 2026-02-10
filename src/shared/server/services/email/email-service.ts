import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { htmlKeyValueReplacer } from '$shared/global/functions/html-key-value-replacer';
import { createTransport } from 'nodemailer';
import type {
	ConsultationRegistrationMessageArgs,
	ContactRequestMessageArgs,
	ShopBuyMessageArgs
} from './model';

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

	async contactRequestMessage(args: ContactRequestMessageArgs) {
		const ownerHtml = (
			await import('./email-templates/contact-request/contact-request-owner.html?raw')
		).default;
		const userHtml = (
			await import('./email-templates/contact-request/contact-request-user.html?raw')
		).default;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`${EMAIL_SUBJECT_PREFIX} Nowa wiadomość od ${args.nameAndSurname}`,
			ownerHtml,
			args
		);

		// Send to user
		await this._send(args.email, `${EMAIL_SUBJECT_PREFIX} Dziękuję za wiadomość!`, userHtml, args);
	}

	async consultationRegistrationMessage(args: ConsultationRegistrationMessageArgs) {
		const ownerHtml = (
			await import(
				'./email-templates/consultation-registration/consultation-registration-owner.html?raw'
			)
		).default;
		const userHtml = (
			await import(
				'./email-templates/consultation-registration/consultation-registration-user.html?raw'
			)
		).default;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`${EMAIL_SUBJECT_PREFIX} Nowa rezerwacja konsultacji od ${args.nameAndSurname}`,
			ownerHtml,
			args
		);

		// Send to user
		await this._send(
			args.email,
			`${EMAIL_SUBJECT_PREFIX} Potwierdzenie rezerwacji konsultacji`,
			userHtml,
			args
		);
	}

	async shopBuyMessage(args: ShopBuyMessageArgs) {
		const ownerHtml = (await import('./email-templates/shop-buy/shop-buy-owner.html?raw')).default;
		const userHtml = (await import('./email-templates/shop-buy/shop-buy-user.html?raw')).default;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`${EMAIL_SUBJECT_PREFIX} Nowy zakup produktu od ${args.nameAndSurname}`,
			ownerHtml,
			args
		);

		// Send to user
		await this._send(
			args.email,
			`${EMAIL_SUBJECT_PREFIX} Potwierdzenie zakupu produktu`,
			userHtml,
			args
		);
	}

	private async _send(to: string, subject: string, html: string, args: Record<string, string>) {
		await this._transport.sendMail({
			from: EMAIL_SENDER,
			to,
			subject,
			html: htmlKeyValueReplacer(html, { subject, ...args })
		});
	}
}
