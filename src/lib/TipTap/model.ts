export interface Props {
	content?: string;
	onUpdate?: (html: string, addedFiles: Record<string, File>) => void;
}
