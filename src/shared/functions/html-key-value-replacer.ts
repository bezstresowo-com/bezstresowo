export function htmlKeyValueReplacer(html: string, replacements: Record<string, string>): string {
	return html.replace(/{{\s*((\w|\d|-|_)+)\s*}}/g, (_, key) => {
		return replacements[key] ?? `{{${key}}}`;
	});
}
