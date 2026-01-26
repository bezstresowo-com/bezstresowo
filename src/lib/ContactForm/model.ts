import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

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
		.required(`${prefix}.phone.errors.required`)
		.test('is-valid-phone', `${prefix}.phone.errors.invalid`, (value) => {
			if (!value) return false;
			return isValidPhoneNumber(value);
		}),
	message: yup
		.string()
		.required(`${prefix}.message.errors.required`)
		.min(10, `${prefix}.message.errors.min`)
		.max(10_000, `${prefix}.message.errors.max`)
});

export type FormValue = yup.InferType<typeof SCHEMA>;

export const FORM_INITIAL_VALUE: FormValue = {
	email: '',
	message: '',
	nameAndSurname: '',
	phone: ''
};

export const FORM_FIELDS: Record<
	keyof FormValue,
	{ type: 'text' | 'email' | 'tel'; element: 'input' | 'textarea'; placement: 'full' | 'shared' }
> = {
	nameAndSurname: { type: 'text', element: 'input', placement: 'shared' },
	email: { type: 'email', element: 'input', placement: 'full' },
	phone: { type: 'tel', element: 'input', placement: 'full' },
	message: { type: 'text', element: 'textarea', placement: 'full' }
};

export const FORM_FIELDS_ORDER: (keyof FormValue)[] = [
	'nameAndSurname',
	'email',
	'phone',
	'message'
];

export const FIELD_MAP: Record<string, keyof FormValue> = {
	tel: 'phone',
	nameAndSurname: 'nameAndSurname',
	email: 'email',
	message: 'message'
};

export type BackendError = { field: string; messages: string[] };
export type BackendErrorResponse = { errors?: BackendError[]; message?: string };
