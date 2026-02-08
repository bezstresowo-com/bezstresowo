import { isValidPhoneNumber } from 'libphonenumber-js';
import * as yup from 'yup';

export const prefix = 'user.pages.reservations';

export const SCHEMA = yup.object().shape({
	therapyType: yup.string().required(`${prefix}.therapyType.errors.required`),
	nameAndSurname: yup
		.string()
		.required(`${prefix}.nameAndSurname.errors.required`)
		.min(1, `${prefix}.nameAndSurname.errors.min`)
		.max(100, `${prefix}.nameAndSurname.errors.max`),
	tel: yup
		.string()
		.required(`${prefix}.tel.errors.required`)
		.test('is-valid-phone', `${prefix}.tel.errors.invalid`, (value) => {
			if (!value) return false;
			return isValidPhoneNumber(value);
		}),
	email: yup
		.string()
		.email(`${prefix}.email.errors.email`)
		.required(`${prefix}.email.errors.required`),
	message: yup.string().max(500, `${prefix}.message.errors.max`).optional()
});

export interface FormValue {
	therapyProductId: string;
	nameAndSurname: string;
	tel: string;
	email: string;
	message: string;
}

export const FORM_INITIAL_VALUE: FormValue = {
	therapyProductId: '',
	nameAndSurname: '',
	tel: '',
	email: '',
	message: ''
};

export const FIELD_MAP: Record<string, keyof FormValue> = {
	therapyProductId: 'therapyProductId',
	nameAndSurname: 'nameAndSurname',
	tel: 'tel',
	email: 'email',
	message: 'message'
};

export type BackendError = { field: string; messages: string[] };
export type BackendErrorResponse = { errors?: BackendError[]; message?: string };
