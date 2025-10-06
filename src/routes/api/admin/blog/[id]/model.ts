import type { BlogArticle } from '@prisma/client';

export type GetBlogArticleResponseDto = BlogArticle;

export class PutBlogArticleRequestDto
	implements Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>
{
	title: string;
	content: string;
	relatedMediaIds: string[];
}

export type PutBlogArticleResponseDto = BlogArticle;
