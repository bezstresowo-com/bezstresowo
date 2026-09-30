import { HttpStatus } from '$shared/global/enums/http-status';
import { findPublishedBlogArticle } from '$shared/server/services/blog/blog-service';
import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

const LEGACY_SLUGS: Record<string, string> = {
	'jak-rozpoznac-toksyczny-zwiazek-15-sygnalow-ktore-nie-warto-ignorowac':
		'how-to-recognize-a-toxic-relationship',
	'iak-rozpiznaty-toksychni-stosunky-15-syhnaliv-iaki-ne-varto-ihnoruvaty':
		'how-to-recognize-a-toxic-relationship',
	'dlaczego-tak-trudno-odejsc-z-toksycznego-zwiazku-nawet-kiedy-wiesz-ze-cie-niszcz':
		'why-it-is-so-hard-to-leave-a-toxic-relationship',
	'chomu-tak-vazhko-pity-z-toksychnykh-stosunkiv-navit-koly-znaiesh-shcho-vony-tebe':
		'why-it-is-so-hard-to-leave-a-toxic-relationship'
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const currentSlug = LEGACY_SLUGS[params.slug];

	if (currentSlug) {
		redirect(308, `/${params.lang}/blog/${currentSlug}`);
	}

	const article = await findPublishedBlogArticle(locals.locale, params.slug);

	if (!article) {
		error(HttpStatus.NOT_FOUND, { message: 'api.errors.NOT_FOUND' });
	}

	return { article };
};
