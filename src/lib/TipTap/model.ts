export interface Props {
	content?: string;
	onUpdate?: (html: string, addedMedia: Record<string, string>) => void;
}
