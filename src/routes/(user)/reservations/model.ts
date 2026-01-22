import { THERAPY_TYPES } from '$shared/global/types/therapy-types';
import * as yup from 'yup';

export { THERAPY_TYPES };

export const prefix = 'user.pages.reservations';

export type TherapyType = (typeof THERAPY_TYPES)[number];

export interface PreferredDate {
	date: string;
	timeFrom: string;
	timeTo: string;
}

export const SCHEMA = yup.object().shape({
	therapyType: yup
		.string()
		.oneOf(THERAPY_TYPES, `${prefix}.therapyType.errors.invalid`)
		.required(`${prefix}.therapyType.errors.required`),
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
		.min(9, `${prefix}.tel.errors.min`)
		.max(15, `${prefix}.tel.errors.max`),
	email: yup
		.string()
		.email(`${prefix}.email.errors.email`)
		.required(`${prefix}.email.errors.required`),
	message: yup
		.string()
		.max(500, `${prefix}.message.errors.max`)
		.when('therapyType', {
			is: 'other',
			then: (schema) => schema.required(`${prefix}.message.errors.requiredForOther`),
			otherwise: (schema) => schema.optional()
		})
});

export const createEmptyPreferredDate = (): PreferredDate => ({
	date: '',
	timeFrom: '',
	timeTo: ''
});

export type FormValue = yup.InferType<typeof SCHEMA>;

export const FORM_INITIAL_VALUE: FormValue = {
	therapyType: '' as TherapyType & '',
	preferredDates: [createEmptyPreferredDate()] as PreferredDate[],
	nameAndSurname: '',
	tel: '',
	email: '',
	message: ''
};

export const FIELD_MAP: Record<string, keyof FormValue> = {
	therapyType: 'therapyType',
	preferredDates: 'preferredDates',
	nameAndSurname: 'nameAndSurname',
	tel: 'tel',
	email: 'email',
	message: 'message'
};

export type BackendError = { field: string; messages: string[] };
export type BackendErrorResponse = { errors?: BackendError[]; message?: string };
