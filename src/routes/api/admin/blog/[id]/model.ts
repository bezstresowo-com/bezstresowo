import { validators } from '$shared/server/validators';
import type { BlogArticle } from '@prisma/client';

const { IsDefined, IsString, IsArray } = validators;

export type GetBlogArticleResponseDto = BlogArticle;

export class PutBlogArticleRequestDto
	implements Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>
{
	@IsDefined()
	@IsString()
	title: string;

	@IsDefined()
	@IsString()
	content: string;

	@IsDefined()
	@IsArray()
	mediaIds: string[];
}

export type PutBlogArticleResponseDto = BlogArticle;
