import type { PaginatedDataResponseDto } from '$shared/global/types/http';
import type { BlogArticle } from '@prisma/client';

export class GetBlogArticlesPaginatedResponseDto implements PaginatedDataResponseDto<BlogArticle> {
	data: {
		id: string;
		title: string;
		content: string;
		mediaUrls: string[];
		createdAt: Date;
		updatedAt: Date;
	}[];
	page: number;
	size: number;
}
