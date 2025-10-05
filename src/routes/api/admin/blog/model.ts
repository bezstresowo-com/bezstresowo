import type { PaginatedDataResponseDto } from '$shared/global/types/http';
import type { BlogArticle } from '@prisma/client';

export class GetBlogArticlesPaginatedResponseDto implements PaginatedDataResponseDto<BlogArticle> {
	data: {
		id: string;
		title: string;
		content: string;
		relatedMediaIds: string[];
		createdAt: Date;
		updatedAt: Date;
	}[];
	page: number;
	size: number;
}

export class PostBlogArticleRequestDto
	implements Omit<BlogArticle, 'id' | 'mediaUrls' | 'createdAt' | 'updatedAt'>
{
	title: string;
	content: string;
	relatedMediaIds: string[];
}

export class PostBlogArticleResponseDto {
	id: string;
}
