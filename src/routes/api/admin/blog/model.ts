import type { PaginatedDataResponseDto } from '$shared/global/types/http';
import { validators } from '$shared/server/validators';
import type { BlogArticle } from '@prisma/client';

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
