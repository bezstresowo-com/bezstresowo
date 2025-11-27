export interface ButtonProps {
	children?: any;
	disabled?: boolean;
	type?: ButtonTypes;
	tailwind?: string;
	href?: string;
	onclick?: () => void;
}

export enum ButtonTypes {
	Button = 'button',
	Submit = 'submit',
	Reset = 'reset'
}
