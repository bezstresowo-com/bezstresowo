import * as yup from 'yup';
const prefix = 'contactForm.form';

export const SCHEMA = yup.object().shape({
	name: yup.string().required(`${prefix}.name.errors.required`),
	companyName: yup.string().required(`${prefix}.companyName.errors.required`),
	email: yup
		.string()
		.email(`${prefix}.email.errors.invalid`)
		.required(`${prefix}.email.errors.required`),
	phone: yup
		.string()
		.matches(/^[\d+\-\s]+$/, `${prefix}.phone.errors.invalid`)
		.required(`${prefix}.phone.errors.required`),
	message: yup.string().required(`${prefix}.message.errors.required`)
});

export type ContactFormValue = yup.InferType<typeof SCHEMA>;
