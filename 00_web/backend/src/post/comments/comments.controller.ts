import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post as HttpPost,
    Req,
    Query,
} from '@nestjs/common';
import express from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../../dto/create_comment.dto';

@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get('posts/:postId/comments')
    async findByPostId(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('page') page = '1',
        @Query('limit') limit = '5',
    ) {
        return this.commentsService.findByPostId(postId, Number(page), Number(limit));
    }

    @HttpPost('posts/:postId/comments')
    async create(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: CreateCommentDto,
        @Req() req: express.Request,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        return this.commentsService.create(postId, dto, user);
    }

    @Delete('comments/:commentId')
    async remove(@Param('commentId', ParseIntPipe) commentId: number, @Req() req: express.Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        return this.commentsService.remove(commentId, user);
    }
}
