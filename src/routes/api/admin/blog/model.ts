import type { PaginatedDataResponseDto } from '$shared/global/types/http';
import type { BlogArticle } from '@prisma/client';

export type GetBlogArticlesPaginatedResponseDto = PaginatedDataResponseDto<BlogArticle>;

export class PostBlogArticleRequestDto
	implements Omit<BlogArticle, 'id' | 'mediaUrls' | 'createdAt' | 'updatedAt'>
{
	title: string;
	content: string;
	relatedMediaIds: string[];
}

export type PostBlogArticleResponseDto = BlogArticle;
