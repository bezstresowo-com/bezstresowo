import * as yup from 'yup';

const required = "Це поле обов'язкове";

export const SCHEMA = yup.object({
	name: yup.string().trim().required(required).max(100, 'Максимум 100 символів'),
	age: yup
		.number()
		.typeError('Вкажи вік цифрами')
		.required(required)
		.positive('Вік має бути більшим за 0')
		.integer('Вкажи повну кількість років')
		.max(120, 'Перевір вказаний вік'),
	email: yup.string().trim().email('Перевір адресу e-mail').required(required),
	contact: yup.string().trim().required(required).min(2, 'Вкажи Telegram або номер телефону'),
	relationshipSituation: yup.string().trim().required(required).min(10, 'Напиши трохи детальніше'),
	hardestPart: yup.string().trim().required(required).min(10, 'Напиши трохи детальніше'),
	expectations: yup.string().trim().required(required).min(10, 'Напиши трохи детальніше'),
	currentHelp: yup
		.string()
		.trim()
		.required(required)
		.min(2, 'Напиши «ні» або коротко опиши допомогу'),
	attendanceConfirmed: yup.string().oneOf(['yes', 'no'], required).required(required),
	privatePlaceConfirmed: yup.string().oneOf(['yes', 'no'], required).required(required),
	additionalInfo: yup.string().trim().max(5000, 'Максимум 5000 символів').default(''),
	consent: yup.boolean().oneOf([true], 'Потрібна згода на обробку даних').required()
});

export type FormValue = {
	name: string;
	age: number | '';
	email: string;
	contact: string;
	relationshipSituation: string;
	hardestPart: string;
	expectations: string;
	currentHelp: string;
	attendanceConfirmed: 'yes' | 'no' | '';
	privatePlaceConfirmed: 'yes' | 'no' | '';
	additionalInfo: string;
	consent: boolean;
};

export const FORM_INITIAL_VALUE: FormValue = {
	name: '',
	age: '',
	email: '',
	contact: '',
	relationshipSituation: '',
	hardestPart: '',
	expectations: '',
	currentHelp: '',
	attendanceConfirmed: '',
	privatePlaceConfirmed: '',
	additionalInfo: '',
	consent: false
};

export const FIELD_MAP: Record<string, keyof FormValue> = {
	name: 'name',
	age: 'age',
	email: 'email',
	contact: 'contact',
	relationshipSituation: 'relationshipSituation',
	hardestPart: 'hardestPart',
	expectations: 'expectations',
	currentHelp: 'currentHelp',
	attendanceConfirmed: 'attendanceConfirmed',
	privatePlaceConfirmed: 'privatePlaceConfirmed',
	additionalInfo: 'additionalInfo',
	consent: 'consent'
};
