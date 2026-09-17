import { query } from '$app/server';
import {
	DEFAULT_SITE_SETTINGS,
	type PublicSiteSettings
} from '$shared/global/config/site-settings';
import { prisma } from '$shared/server/services/prisma/prisma-service';

/** Public singleton. Before the first panel save, current site values remain visible. */
export const getSiteSettings = query(async (): Promise<PublicSiteSettings> => {
	const settings = await prisma.siteSettings.findUnique({ where: { key: 'main' } });

	if (!settings) {
		return DEFAULT_SITE_SETTINGS;
	}

	return {
		phone: settings.phone,
		email: settings.email,
		locationPl: settings.locationPl,
		locationUk: settings.locationUk,
		hoursWeek: settings.hoursWeek,
		hoursSaturday: settings.hoursSaturday,
		facebookUrl: settings.facebookUrl,
		instagramPlUrl: settings.instagramPlUrl,
		instagramUkUrl: settings.instagramUkUrl,
		telegramUkUrl: settings.telegramUkUrl
	};
});
