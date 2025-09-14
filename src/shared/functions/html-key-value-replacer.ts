export function htmlKeyValueReplacer(html: string, replacements: Record<string, string>): string {
	return html.replace(/{{(.*?)}}/g, (_, key) => {
		return replacements[key] ?? `{{${key}}}`;
	});
}
