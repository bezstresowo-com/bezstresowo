export interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	color?: string;
	label?: string;
	tailwind?: string;
}

export const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
	sm: 'h-4 w-4 border-2',
	md: 'h-6 w-6 border-2',
	lg: 'h-10 w-10 border-4'
};
