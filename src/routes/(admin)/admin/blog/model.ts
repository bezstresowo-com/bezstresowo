import type { GetBlogArticlesPaginatedResponseDto } from '$api/admin/blog/model';
import { resolve } from '$app/paths';
import { HttpMethod } from '$shared/global/enums/http-method';
import { baseFetch } from '$shared/global/functions/base-fetch';
import { getBaseHeaders } from '$shared/global/functions/get-base-headers';
import { PaginationParamsDto } from '$shared/global/types/http';

export async function fetchBlogPosts(
	providedParams: PaginationParamsDto = new PaginationParamsDto()
) {
	const params = new URLSearchParams(
		Object.entries(providedParams).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: `${value}`
			}),
			{} as Record<string, string>
		)
	);

	return await baseFetch<GetBlogArticlesPaginatedResponseDto>(
		async () =>
			await fetch(`${resolve('/api/admin/blog')}?${params.toString()}`, {
				method: HttpMethod.GET,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}
