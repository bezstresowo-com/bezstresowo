import { EMAIL_APP_PASSWORD, EMAIL_SENDER, EMAIL_SUBJECT_PREFIX } from '$env/static/private';
import { createTransport } from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
	try {
		const transporter = createTransport({
			service: 'gmail',
			auth: {
				user: EMAIL_SENDER,
				pass: EMAIL_APP_PASSWORD
			}
		});

		const mailOptions = {
			from: EMAIL_SENDER,
			to,
			subject: `${EMAIL_SUBJECT_PREFIX} ${subject}`,
			html
		};

		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error({ error });
	}
}
