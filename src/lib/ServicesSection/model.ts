function getItemsInRow(
	itemName: 'paragraph',
	length: number,
	start = 0
): `${typeof itemName}${number}`[] {
	return Array.from({ length }).map(
		(_, i) => `${itemName}${i + start}`
	) as `${typeof itemName}${number}`[];
}

export const OFFERED_SERVICES: {
	prefix: string;
	icon: string;
	extended: {
		[key: `section${number}`]: ('title' | `paragraph${number}` | `list${number}:${number}`)[];
	}[];
}[] = [
	{
		prefix: 'user.pages.home.offeredServices.services.couplesTherapy',
		icon: 'fa-solid fa-people-arrows',
		extended: [
			{ section0: ['title', 'paragraph0'] },
			{ section1: ['title', 'paragraph0', 'list0:5'] },
			{ section2: ['title', 'list0:4'] },
			{ section3: ['title', 'list0:5'] }
		]
	},
	{
		prefix: 'user.pages.home.offeredServices.services.womenTherapy',
		icon: 'fa-solid fa-venus',
		extended: [
			{ section0: [...getItemsInRow('paragraph', 2)] },
			{ section1: ['title', 'paragraph0', 'list0:6', 'paragraph1'] },
			{ section2: ['title', ...getItemsInRow('paragraph', 12)] },
			{ section3: ['title', ...getItemsInRow('paragraph', 2)] }
		]
	},
	{
		prefix: 'user.pages.home.offeredServices.services.depressionTherapy',
		icon: 'fa-solid fa-brain',
		extended: [
			{ section0: [...getItemsInRow('paragraph', 2)] },
			{ section1: ['title', 'paragraph0', 'list0:6', 'paragraph1'] },
			{ section2: ['title', ...getItemsInRow('paragraph', 12)] },
			{ section3: ['title', ...getItemsInRow('paragraph', 2), 'list0:4', 'paragraph2'] },
			{ section4: ['title', 'list0:4'] }
		]
	},
	{
		prefix: 'user.pages.home.offeredServices.services.lgbtTherapy',
		icon: 'fa-solid fa-mars-and-venus-burst',
		extended: [
			{ section0: [...getItemsInRow('paragraph', 2)] },
			{ section1: ['title', 'paragraph0', 'list0:6', 'paragraph1'] },
			{ section2: ['title', ...getItemsInRow('paragraph', 12)] },
			{ section3: ['title', ...getItemsInRow('paragraph', 2), 'list0:4'] },
			{ section4: ['title', 'list0:4'] }
		]
	},
	{
		prefix: 'user.pages.home.offeredServices.services.parentTherapy',
		icon: 'fa-solid fa-hands-holding-child',
		extended: [
			{ section0: [...getItemsInRow('paragraph', 2)] },
			{ section1: ['title', 'paragraph0', 'list0:6', 'paragraph1'] },
			{ section2: ['title', ...getItemsInRow('paragraph', 12)] },
			{ section3: ['title', 'paragraph0', 'list0:3', 'paragraph1'] },
			{ section4: ['title', 'list0:4'] }
		]
	},
	{
		prefix: 'user.pages.home.offeredServices.services.eatingDisorderTherapy',
		icon: 'fa-solid fa-apple-whole',
		extended: [
			{ section0: [...getItemsInRow('paragraph', 2)] },
			{ section1: ['title', 'paragraph0', 'list0:6', 'paragraph1'] },
			{ section2: ['title', ...getItemsInRow('paragraph', 10)] },
			{ section3: ['title', ...getItemsInRow('paragraph', 2), 'list0:4', 'paragraph2'] }
		]
	}
];

export enum ExtendedTranslationType {
	title = 'title',
	paragraph = 'paragraph',
	listItem = 'listItem'
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
