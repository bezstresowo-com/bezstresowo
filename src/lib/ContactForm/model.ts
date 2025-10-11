import * as yup from 'yup';

const prefix = 'user.contactForm.fields';

export const SCHEMA = yup.object().shape({
	nameAndSurname: yup
		.string()
		.required(`${prefix}.nameAndSurname.errors.required`)
		.min(1, `${prefix}.name.errors.min`)
		.max(100, `${prefix}.name.errors.max`),
	email: yup
		.string()
		.email(`${prefix}.email.errors.email`)
		.required(`${prefix}.email.errors.required`),
	phone: yup
		.string()
		.matches(/^[\d+\-\s]+$/, `${prefix}.phone.errors.matches`)
		.required(`${prefix}.phone.errors.required`),
	message: yup
		.string()
		.required(`${prefix}.message.errors.required`)
		.min(10, `${prefix}.message.errors.min`)
		.max(10_000, `${prefix}.message.errors.max`)
});

export type ContactFormValue = yup.InferType<typeof SCHEMA>;

export const FORM_INITIAL_VALUE: ContactFormValue = {
	email: '',
	message: '',
	nameAndSurname: '',
	phone: '',
};

export const FORM_FIELDS: Record<
	keyof ContactFormValue,
	{ type: 'text' | 'email' | 'tel'; element: 'input' | 'textarea'; placement: 'full' | 'shared' }
> = {
	nameAndSurname: { type: 'text', element: 'input', placement: 'shared' },
	email: { type: 'email', element: 'input', placement: 'full' },
	phone: { type: 'tel', element: 'input', placement: 'full' },
	message: { type: 'text', element: 'textarea', placement: 'full' }
};

export const FORM_FIELDS_ORDER: (keyof ContactFormValue)[] = [
	'nameAndSurname',
	'email',
	'phone',
	'message'
];
