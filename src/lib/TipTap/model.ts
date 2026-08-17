export interface Props {
	content?: string;
	/** `mediaIds` lists every image / video currently present in the document. */
	onUpdate?: (html: string, mediaIds: string[]) => void;
}
