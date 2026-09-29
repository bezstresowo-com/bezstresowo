function getItemsInRow(
	itemName: 'paragraph',
	length: number,
	start = 0
): `${typeof itemName}${number}`[] {
	return Array.from({ length }).map(
		(_, i) => `${itemName}${i + start}`
	) as `${typeof itemName}${number}`[];
}

export const SERVICE_SLUGS = [
	'psychoterapia-par',
	'psychoterapia-dla-kobiet',
	'psychoterapia-depresji-i-leku',
	'psychoterapia-lgbt',
	'konsultacje-dla-rodzicow',
	'psychoterapia-zaburzen-odzywiania'
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type OfferedService = {
	slug: ServiceSlug;
	prefix: string;
	icon: string;
	extended: {
		[key: `section${number}`]: ('title' | `paragraph${number}` | `list${number}:${number}`)[];
	}[];
};

export const OFFERED_SERVICES: OfferedService[] = [
	{
		slug: 'psychoterapia-par',
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
		slug: 'psychoterapia-dla-kobiet',
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
		slug: 'psychoterapia-depresji-i-leku',
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
		slug: 'psychoterapia-lgbt',
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
		slug: 'konsultacje-dla-rodzicow',
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
		slug: 'psychoterapia-zaburzen-odzywiania',
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

export type ServiceContentBlock =
	| { type: 'paragraph'; translationKey: string }
	| { type: 'list'; translationKeys: string[] };

export type ServiceContentSection = {
	titleKey?: string;
	blocks: ServiceContentBlock[];
};

export function isServiceSlug(value: string): value is ServiceSlug {
	return (SERVICE_SLUGS as readonly string[]).includes(value);
}

export function getServiceBySlug(slug: string): OfferedService | undefined {
	return OFFERED_SERVICES.find((service) => service.slug === slug);
}

export function getServiceContentSections(service: OfferedService): ServiceContentSection[] {
	const { prefix, extended } = service;
	const sections: ServiceContentSection[] = [];

	for (const section of extended) {
		const [sectionName, parts] = Object.entries(section)[0] as [string, string[]];
		const contentSection: ServiceContentSection = { blocks: [] };

		for (const part of parts) {
			if (/title.*/.test(part)) {
				contentSection.titleKey = `${prefix}.extended.${sectionName}.${part}`;
			} else if (/paragraph.*/.test(part)) {
				contentSection.blocks.push({
					type: 'paragraph',
					translationKey: `${prefix}.extended.${sectionName}.${part}`
				});
			} else if (/list.*/.test(part)) {
				const [partKey, len] = part.split(':') as [string, string];
				contentSection.blocks.push({
					type: 'list',
					translationKeys: Array.from(
						{ length: Number(len) },
						(_, i) => `${prefix}.extended.${sectionName}.${partKey}.${i}`
					)
				});
			}
		}

		sections.push(contentSection);
	}

	return sections;
}
