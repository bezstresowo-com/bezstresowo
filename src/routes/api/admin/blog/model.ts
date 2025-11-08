import type { PaginatedDataResponseDto } from '$shared/global/types/http';
import type { BlogArticle } from '@prisma/client';
import { validators } from '$shared/server/validators';

const { IsDefined, IsString, IsArray } = validators;

export type GetBlogArticlesPaginatedResponseDto = PaginatedDataResponseDto<BlogArticle>;

export class PostBlogArticleRequestDto
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

export type PostBlogArticleResponseDto = BlogArticle;
