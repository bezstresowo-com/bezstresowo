import * as yup from 'yup';

const prefix = 'admin.blog.dialog.form.fields';

export const SCHEMA = yup.object().shape({
	title: yup
		.string()
		.required(`${prefix}.title.errors.required`)
		.max(100, ({ max }) => `${prefix}.title.errors.max@${JSON.stringify({ max })}`)
});

export type FormValue = yup.InferType<typeof SCHEMA>;

export const INITIAL_FORM_VALUE: FormValue = {
	title: ''
};

export const FORM_FIELDS: Record<
	keyof FormValue,
	{
		type: 'text';
	}
> = {
	title: {
		type: 'text'
	}
};

export const FORM_FIELDS_ORDER: (keyof FormValue)[] = ['title'];
