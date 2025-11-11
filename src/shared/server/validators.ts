import * as cv from 'class-validator';

export const VALIDATION_MSG_PREFIX = 'api.validation.errors' as const;

// Helper function to add default translation messages
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function withTranslationMessage(name: string, fn: Function) {
	return (...args: any[]) => {
		const lastArg = args[args.length - 1];
		const isOptions = typeof lastArg === 'object' && !Array.isArray(lastArg);

		let msgSuffix = '';
		switch (name) {
			case 'MinLength':
			case 'MaxLength':
			case 'Min':
			case 'Max':
				msgSuffix = `@${JSON.stringify({ length: args[0] })}`;
				break;

			default:
				msgSuffix = '';
		}

		const options = isOptions ? { ...lastArg } : {};
		options.message = options.message ?? `${VALIDATION_MSG_PREFIX}.${name}${msgSuffix}`;

		if (isOptions) {
			args[args.length - 1] = options;
		} else {
			args.push(options);
		}

		return fn(...args);
	};
}

/* 
	TODO:
	Remember to overwrite the validators which need to have custom validation messages
*/
export const validators = {
	...cv,
	MinLength: withTranslationMessage('MinLength', cv.MinLength),
	MaxLength: withTranslationMessage('MaxLength', cv.MaxLength),
	Min: withTranslationMessage('Min', cv.Min),
	Max: withTranslationMessage('Max', cv.Max),
	IsDefined: withTranslationMessage('IsDefined', cv.IsDefined),
	IsPhoneNumber: withTranslationMessage('IsPhoneNumber', cv.IsPhoneNumber),
	IsEmail: withTranslationMessage('IsEmail', cv.IsEmail),
	IsString: withTranslationMessage('IsString', cv.IsString)
};
