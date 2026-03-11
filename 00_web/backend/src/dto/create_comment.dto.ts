import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @MinLength(1, { message: '댓글 내용을 입력하세요.' })
    @MaxLength(500, { message: '댓글은 500자 이하로 입력하세요.' })
    content: string;
}
