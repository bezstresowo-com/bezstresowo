import * as cv from 'class-validator';

export const VALIDATION_MSG_PREFIX = 'api.validation.errors' as const;

export const validators = new Proxy(cv, {
	get(target, prop: ClassValidatorExportName) {
		const value = (target as any)[prop];
		if (typeof value === 'function' && /^[A-Z]/.test(prop)) {
			return withTranslationMessage(prop, value);
		}
		return value;
	}
});

type ClassValidatorExportName = keyof typeof cv;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function withTranslationMessage(name: string, fn: Function) {
	return (...args: any[]) => {
		const lastArg = args[args.length - 1];
		const isOptions = typeof lastArg === 'object' && !Array.isArray(lastArg);

		let msgSuffix = '';
		switch (name as ClassValidatorExportName) {
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
