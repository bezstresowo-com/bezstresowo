import * as yup from 'yup';

export const prefix = 'user.pages.reservations';

export const SCHEMA = yup.object().shape({
	nameAndSurname: yup
		.string()
		.required(`${prefix}.nameAndSurname.errors.required`)
		.min(1, `${prefix}.nameAndSurname.errors.min`)
		.max(100, `${prefix}.nameAndSurname.errors.max`),
	tel: yup
		.string()
		.required(`${prefix}.tel.errors.required`)
		.min(9, `${prefix}.tel.errors.min`)
		.max(15, `${prefix}.tel.errors.max`),
	email: yup
		.string()
		.email(`${prefix}.email.errors.email`)
		.required(`${prefix}.email.errors.required`),
	checkInDate: yup.string().required(`${prefix}.checkInDate.errors.required`)
});

export const FORM_INITIAL_VALUE = {
	nameAndSurname: '',
	tel: '',
	email: '',
	checkInDate: ''
};

export type FormValue = yup.InferType<typeof SCHEMA>;

export const FORM_FIELDS: Record<
	keyof FormValue,
	{ type: 'text' | 'email' | 'tel' | 'date'; element: 'input'; placement: 'full' | 'shared' }
> = {
	nameAndSurname: { type: 'text', element: 'input', placement: 'shared' },
	tel: { type: 'tel', element: 'input', placement: 'shared' },
	email: { type: 'email', element: 'input', placement: 'full' },
	checkInDate: { type: 'date', element: 'input', placement: 'full' }
};

export const FORM_FIELDS_ORDER: (keyof FormValue)[] = [
	'nameAndSurname',
	'tel',
	'email',
	'checkInDate'
];

export const FIELD_MAP: Record<string, keyof FormValue> = {
	nameAndSurname: 'nameAndSurname',
	tel: 'tel',
	email: 'email',
	checkInDate: 'checkInDate'
};

export type BackendError = { field: string; messages: string[] };
export type BackendErrorResponse = { errors?: BackendError[]; message?: string };
