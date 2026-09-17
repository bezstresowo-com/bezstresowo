import { command, query } from '$app/server';
import { DEFAULT_SITE_SETTINGS } from '$shared/global/config/site-settings';
import { dtoSchema } from '$shared/server/functions/dto-schema';
import { requireAdmin } from '$shared/server/functions/require-admin';
import { prisma } from '$shared/server/services/prisma/prisma-service';

import { UpdateSiteSettingsDto } from './dto/site-settings';

export const getAdminSiteSettings = query(async () => {
	requireAdmin();

	return (
		(await prisma.siteSettings.findUnique({ where: { key: 'main' } })) ?? DEFAULT_SITE_SETTINGS
	);
});

export const updateSiteSettings = command(dtoSchema(UpdateSiteSettingsDto), async (dto) => {
	requireAdmin();

	return prisma.siteSettings.upsert({
		where: { key: 'main' },
		create: { key: 'main', ...dto },
		update: dto
	});
});
