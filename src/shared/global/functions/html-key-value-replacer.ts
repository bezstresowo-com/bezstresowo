const HTML_ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

/**
 * Values come straight from user input (forms, Stripe metadata) and land in
 * email HTML - they are always escaped, so a template can never be broken out
 * of. Unknown placeholders are left as-is to stay visible in the delivered mail.
 */
export function htmlKeyValueReplacer(html: string, replacements: Record<string, string>): string {
	return html.replace(/{{\s*((\w|\d|-|_)+)\s*}}/g, (_, key) => {
		const value = replacements[key];

		return value === undefined
			? `{{${key}}}`
			: value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
	});
}
