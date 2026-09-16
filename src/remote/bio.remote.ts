import { query } from '$app/server';
import { DEFAULT_LOCALE, Locale } from '$i18n';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { prisma } from '$shared/server/services/prisma/prisma-service';
import { S3Service } from '$shared/server/services/s3/s3-service';
import { isNil } from 'lodash-es';

import { BioParamsDto, type LocalizedBio } from './dto/bio';

const FALLBACK_BIO: Record<Locale, LocalizedBio> = {
	[Locale.plPL]: {
		imageUrl: '/assets/about-me.jpg',
		content: [
			'Nazywam się <strong>Olesya Haiduk</strong>.',
			'Jestem psychoterapeutką po ukończonym 4-letnim szkoleniu psychoterapeutycznym w Międzynarodowym Towarzystwie Analizy Transakcyjnej. Prowadzę psychoterapię indywidualną oraz terapię par.',
			'Pracuję z osobami doświadczającymi trudności w relacjach, zaburzeń odżywiania, stanów lękowych, depresji, niskiej samooceny, współuzależnienia i traumatycznych przeżyć. Wspieram również osoby LGBT+, zapewniając przestrzeń opartą na akceptacji, zrozumieniu i profesjonalnej pomocy.',
			'Specjalizuję się w analizie transakcyjnej, która pomaga rozpoznawać powtarzające się schematy, role przyjmowane w relacjach i sposoby komunikacji. Pracuję zgodnie z kodeksem etycznym psychoterapeuty i pod stałą superwizją.',
			'Stale rozwijam swoje umiejętności, uczestnicząc w kursach, konferencjach i szkoleniach zawodowych. Moją najważniejszą zasadą jest tworzenie bezpiecznej przestrzeni, w której można poczuć się usłyszanym, zrozumianym i akceptowanym.'
		]
			.map((paragraph) => `<p>${paragraph}</p>`)
			.join('')
	},
	[Locale.ukUA]: {
		imageUrl: '/assets/about-me.jpg',
		content: [
			'Мене звати <strong>Олеся Гайдук</strong>.',
			'Я психолог і психотерапевт із завершеним 4-річним циклом навчання в Міжнародному товаристві транзакційного аналізу. Проводжу індивідуальну психотерапію та терапію для пар.',
			'Працюю з людьми, які переживають труднощі у стосунках, розлади харчової поведінки, тривожні й депресивні стани, низьку самооцінку, співзалежність і травматичний досвід. Підтримую також представників ЛГБТК+ спільноти, створюючи простір прийняття, розуміння та професійної допомоги.',
			'Моя спеціалізація — транзакційний аналіз. Цей метод допомагає розпізнавати повторювані сценарії, ролі у стосунках і способи комунікації. Працюю відповідно до етичного кодексу психолога та психотерапевта і регулярно проходжу супервізію.',
			'Постійно вдосконалюю знання та навички, беру участь у курсах, тренінгах і професійних конференціях. Для мене важливо створювати безпечний простір, у якому людина може почуватися почутою, зрозумілою та прийнятою.'
		]
			.map((paragraph) => `<p>${paragraph}</p>`)
			.join('')
	}
};

/**
 * The "About me" section of the home page. `null` (nothing seeded yet) simply
 * hides the section - there is no hardcoded fallback content anymore.
 */
export const getBio = query(
	dtoSchema(BioParamsDto),
	async ({ lang }): Promise<LocalizedBio | null> => {
		const bio = await prisma.bio.findFirst({ include: { internationalizedBios: true } });

		if (isNil(bio)) {
			return FALLBACK_BIO[lang];
		}

		const translation =
			bio.internationalizedBios.find((candidate) => candidate.lang === lang) ??
			bio.internationalizedBios.find((candidate) => candidate.lang === DEFAULT_LOCALE) ??
			bio.internationalizedBios[0];

		if (isNil(translation)) {
			return FALLBACK_BIO[lang];
		}

		return {
			imageUrl: isNil(bio.imageId) ? null : new S3Service().buildUrl(bio.imageId),
			content: translation.content
		};
	}
);
