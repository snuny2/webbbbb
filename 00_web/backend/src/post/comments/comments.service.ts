import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from '../../dto/create_comment.dto';
import { Post } from '../post.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepo: Repository<Comment>,

        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,
    ) {}

    async findByPostId(postId: number, page: number, limit: number) {
        const post = await this.postsRepo.findOne({ where: { id: postId } });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        const [comments, total] = await this.commentsRepo.findAndCount({
            where: { postId },
            relations: ['author'],
            order: { id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            items: comments,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async create(postId: number, dto: CreateCommentDto, user: any) {
        const post = await this.postsRepo.findOne({ where: { id: postId } });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        const comment = this.commentsRepo.create({
            content: dto.content,
            postId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            authorId: user.sub,
        });

        return await this.commentsRepo.save(comment);
    }

    async remove(commentId: number, user: any) {
        const comment = await this.commentsRepo.findOne({
            where: { id: commentId },
        });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (comment.authorId !== user.sub) {
            throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
        }

        await this.commentsRepo.remove(comment);

        return { message: '댓글이 삭제되었습니다.' };
    }
}
