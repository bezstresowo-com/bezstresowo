import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { Locale, LOCALE_HTML_LANG, translationsFor } from '$i18n';
import { htmlKeyValueReplacer } from '$shared/global/functions/html-key-value-replacer';
import { createTransport } from 'nodemailer';
import type {
	ConsultationRegistrationMessageArgs,
	ContactRequestMessageArgs,
	ShopBuyMessageArgs
} from './model';

/**
 * Owner notifications are always polish (the owner reads polish); the customer
 * copy is rendered in `locale` - the language the visitor used on the site.
 */
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

	async contactRequestMessage(locale: Locale, args: ContactRequestMessageArgs) {
		const ownerHtml = (
			await import('./email-templates/contact-request/contact-request-owner.html?raw')
		).default;
		const userHtml = (
			await import('./email-templates/contact-request/contact-request-user.html?raw')
		).default;
		const { contactRequest } = translationsFor(locale).api.emails;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`${EMAIL_SUBJECT_PREFIX} Nowa wiadomość od ${args.nameAndSurname}`,
			ownerHtml,
			args
		);

		// Send to user
		await this._send(
			args.email,
			`${EMAIL_SUBJECT_PREFIX} ${contactRequest.userSubject}`,
			userHtml,
			{
				...args,
				...userTemplateVars(locale),
				tHeader: contactRequest.header,
				tIntro: contactRequest.intro({ nameAndSurname: args.nameAndSurname })
			}
		);
	}

	async consultationRegistrationMessage(locale: Locale, args: ConsultationRegistrationMessageArgs) {
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

		const { consultationRegistration, common } = translationsFor(locale).api.emails;

		// Send to owner - the "no message" fallback is localized per recipient.
		await this._send(
			EMAIL_SENDER,
			`${EMAIL_SUBJECT_PREFIX} Nowa rezerwacja konsultacji od ${args.nameAndSurname}`,
			ownerHtml,
			{ ...args, message: args.message || translationsFor(Locale.plPL).api.emails.common.noMessage }
		);

		// Send to user
		await this._send(
			args.email,
			`${EMAIL_SUBJECT_PREFIX} ${consultationRegistration.userSubject}`,
			userHtml,
			{
				...args,
				message: args.message || common.noMessage,
				...userTemplateVars(locale),
				tHeader: consultationRegistration.header,
				tIntro: consultationRegistration.intro({ nameAndSurname: args.nameAndSurname }),
				tSummary: consultationRegistration.summary,
				tTherapyLabel: consultationRegistration.therapyLabel
			}
		);
	}

	async shopBuyMessage(locale: Locale, args: ShopBuyMessageArgs) {
		const ownerHtml = (await import('./email-templates/shop-buy/shop-buy-owner.html?raw')).default;
		const userHtml = (await import('./email-templates/shop-buy/shop-buy-user.html?raw')).default;

		const { shopBuy } = translationsFor(locale).api.emails;

		// Send to owner
		await this._send(
			EMAIL_SENDER,
			`${EMAIL_SUBJECT_PREFIX} Nowy zakup produktu od ${args.nameAndSurname}`,
			ownerHtml,
			args
		);

		// Send to user
		await this._send(args.email, `${EMAIL_SUBJECT_PREFIX} ${shopBuy.userSubject}`, userHtml, {
			...args,
			...userTemplateVars(locale),
			tHeader: shopBuy.header,
			tIntro: shopBuy.intro,
			tSummary: shopBuy.summary,
			tProductLabel: shopBuy.productLabel,
			tPriceLabel: shopBuy.priceLabel
		});
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

/** Placeholders shared by every customer facing template. */
function userTemplateVars(locale: Locale): Record<string, string> {
	const { common } = translationsFor(locale).api.emails;

	return {
		emailLang: LOCALE_HTML_LANG[locale],
		tYourMessage: common.yourMessage,
		tYourData: common.yourData,
		tNameLabel: common.nameLabel,
		tEmailLabel: common.emailLabel,
		tPhoneLabel: common.phoneLabel,
		tSignatureName: common.signatureName,
		tSignatureRole: common.signatureRole,
		tContactViaSite: common.contactViaSite,
		tCompanyLine: common.companyLine,
		tSystemNotice: common.systemNotice
	};
}
