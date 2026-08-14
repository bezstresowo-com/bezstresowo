import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { LOCALE_HTML_LANG, translateWith, type Locale } from '$i18n';
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
			`${EMAIL_SUBJECT_PREFIX} ${tr(locale, 'contactRequest.userSubject')}`,
			userHtml,
			{
				...args,
				...userTemplateVars(locale),
				tHeader: tr(locale, 'contactRequest.header'),
				tIntro: tr(locale, 'contactRequest.intro', { nameAndSurname: args.nameAndSurname })
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
			`${EMAIL_SUBJECT_PREFIX} ${tr(locale, 'consultationRegistration.userSubject')}`,
			userHtml,
			{
				...args,
				...userTemplateVars(locale),
				tHeader: tr(locale, 'consultationRegistration.header'),
				tIntro: tr(locale, 'consultationRegistration.intro', {
					nameAndSurname: args.nameAndSurname
				}),
				tSummary: tr(locale, 'consultationRegistration.summary'),
				tTherapyLabel: tr(locale, 'consultationRegistration.therapyLabel')
			}
		);
	}

	async shopBuyMessage(locale: Locale, args: ShopBuyMessageArgs) {
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
			`${EMAIL_SUBJECT_PREFIX} ${tr(locale, 'shopBuy.userSubject')}`,
			userHtml,
			{
				...args,
				...userTemplateVars(locale),
				tHeader: tr(locale, 'shopBuy.header'),
				tIntro: tr(locale, 'shopBuy.intro'),
				tSummary: tr(locale, 'shopBuy.summary'),
				tProductLabel: tr(locale, 'shopBuy.productLabel'),
				tPriceLabel: tr(locale, 'shopBuy.priceLabel')
			}
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

/** `api.emails.*` lookup in the customer's language. */
function tr(locale: Locale, key: string, vars?: Record<string, unknown>): string {
	return translateWith(locale, `api.emails.${key}`, vars);
}

/** Placeholders shared by every customer facing template. */
function userTemplateVars(locale: Locale): Record<string, string> {
	return {
		emailLang: LOCALE_HTML_LANG[locale],
		tYourMessage: tr(locale, 'common.yourMessage'),
		tYourData: tr(locale, 'common.yourData'),
		tNameLabel: tr(locale, 'common.nameLabel'),
		tEmailLabel: tr(locale, 'common.emailLabel'),
		tPhoneLabel: tr(locale, 'common.phoneLabel'),
		tSignatureName: tr(locale, 'common.signatureName'),
		tSignatureRole: tr(locale, 'common.signatureRole'),
		tContactViaSite: tr(locale, 'common.contactViaSite'),
		tCompanyLine: tr(locale, 'common.companyLine'),
		tSystemNotice: tr(locale, 'common.systemNotice')
	};
}
