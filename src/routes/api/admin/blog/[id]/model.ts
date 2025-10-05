import type { BlogArticle } from '@prisma/client';

export class PutBlogArticleRequestDto
	implements Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>
{
	title: string;
	content: string;
	relatedMediaIds: string[];
}

export class PutBlogArticleResponseDto {
	id: string;
}
