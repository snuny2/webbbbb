import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다.' })
    @MaxLength(100, { message: '제목은 100자 이하만 가능합니다.' })
    title: string;

    @IsString()
    @MinLength(2, { message: '내용은 최소 2자 이상이어야 합니다.' })
    content: string;
}
