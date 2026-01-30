export const OFFERED_SERVICES = [
	{
		prefix: 'user.pages.home.offeredServices.services.couplesTherapy',
		icon: 'fa-solid fa-users',
		extended: [
			{ section0: ['title', 'paragraph0'] },
			{ section1: ['title', 'paragraph0', 'list0:5'] },
			{ section2: ['title', 'list0:4'] },
			{ section3: ['title', 'list0:5'] }
		]
	},
	{
		prefix: 'user.pages.home.offeredServices.services.transactionalTherapy',
		icon: 'fa-solid fa-heart',
		extended: [
			{ section0: ['title', 'paragraph0'] },
			{ section1: ['title', 'paragraph0', 'list0:4'] },
			{ section2: ['title', 'paragraph0', 'list0:6'] },
			{ section3: ['title', 'paragraph0'] }
		]
	}
];

export enum ExtendedTranslationType {
	title,
	paragraph,
	listItem
}
type ExtendedTranslation = { type: ExtendedTranslationType; value: string };

export function getExtendedTranslations(index: number): ExtendedTranslation[] {
	if (index < 0 || index >= OFFERED_SERVICES.length) {
		return [];
	}

	const { prefix, extended } = OFFERED_SERVICES[index];
	const translations: ExtendedTranslation[] = [];
	for (const section of extended) {
		const [sectionName, parts] = Object.entries(section)[0] as [string, string[]];

		for (const part of parts) {
			if (/title.*/.test(part)) {
				translations.push({
					type: ExtendedTranslationType.title,
					value: `${prefix}.extended.${sectionName}.${part}`
				} satisfies ExtendedTranslation);
			} else if (/paragraph.*/.test(part)) {
				translations.push({
					type: ExtendedTranslationType.paragraph,
					value: `${prefix}.extended.${sectionName}.${part}`
				} satisfies ExtendedTranslation);
			} else if (/list.*/.test(part)) {
				const [partKey, len] = part.split(':') as [string, string];
				translations.push(
					...Array.from({ length: Number(len) }).map(
						(_, i) =>
							({
								type: ExtendedTranslationType.listItem,
								value: `${prefix}.extended.${sectionName}.${partKey}.${i}`
							}) satisfies ExtendedTranslation
					)
				);
			}
		}
	}

	return translations;
}
