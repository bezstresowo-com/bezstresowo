import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const prefix = 'user.pages.reservations';

export interface PreferredDate {
	date: string;
	timeFrom: string;
	timeTo: string;
}

export const SCHEMA = yup.object().shape({
	therapyType: yup.string().required(`${prefix}.therapyType.errors.required`),
	preferredDates: yup
		.array()
		.of(
			yup.object().shape({
				date: yup.string().required(`${prefix}.preferredDates.errors.dateRequired`),
				timeFrom: yup.string().required(`${prefix}.preferredDates.errors.timeFromRequired`),
				timeTo: yup
					.string()
					.required(`${prefix}.preferredDates.errors.timeToRequired`)
					.when('timeFrom', ([timeFrom], schema) =>
						timeFrom
							? schema.test(
									'time-order',
									`${prefix}.preferredDates.errors.timeOrder`,
									(timeTo) => !timeTo || timeFrom < timeTo
								)
							: schema
					)
			})
		)
		.min(1, `${prefix}.preferredDates.errors.min`)
		.max(5, `${prefix}.preferredDates.errors.max`)
		.required(`${prefix}.preferredDates.errors.required`),
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

export const createEmptyPreferredDate = (): PreferredDate => ({
	date: '',
	timeFrom: '',
	timeTo: ''
});

export interface FormValue {
	therapyProductId: string;
	preferredDates: PreferredDate[];
	nameAndSurname: string;
	tel: string;
	email: string;
	message: string;
}

export const FORM_INITIAL_VALUE: FormValue = {
	therapyProductId: '',
	preferredDates: [createEmptyPreferredDate()],
	nameAndSurname: '',
	tel: '',
	email: '',
	message: ''
};

export const FIELD_MAP: Record<string, keyof FormValue> = {
	therapyProductId: 'therapyProductId',
	preferredDates: 'preferredDates',
	nameAndSurname: 'nameAndSurname',
	tel: 'tel',
	email: 'email',
	message: 'message'
};

export type BackendError = { field: string; messages: string[] };
export type BackendErrorResponse = { errors?: BackendError[]; message?: string };
