import type { PutBlogArticleRequestDto } from '$api/admin/blog/[id]/model';
import type {
	GetBlogArticlesPaginatedResponseDto,
	PostBlogArticleRequestDto
} from '$api/admin/blog/model';
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

export async function deleteBlogPost(id: string) {
	return await baseFetch<void>(
		async () =>
			await fetch(resolve('/api/admin/blog/[id]', { id }), {
				method: HttpMethod.DELETE,
				headers: {
					...getBaseHeaders()
				}
			})
	);
}

export async function updateBlogPost(id: string, data: PutBlogArticleRequestDto) {
	return await baseFetch<void>(
		async () =>
			await fetch(resolve('/api/admin/blog/[id]', { id }), {
				method: HttpMethod.PUT,
				headers: {
					...getBaseHeaders(),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	);
}

export async function createBlogPost(data: PostBlogArticleRequestDto) {
	return await baseFetch<void>(
		async () =>
			await fetch(resolve('/api/admin/blog'), {
				method: HttpMethod.POST,
				headers: {
					...getBaseHeaders(),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	);
}
