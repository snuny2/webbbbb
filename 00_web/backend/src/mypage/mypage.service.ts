import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../post/comments/comment.entity';

@Injectable()
export class MypageService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,

        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,

        @InjectRepository(Comment)
        private readonly commentsRepo: Repository<Comment>,
    ) {}

    async getMyPageData(
        userId: number,
        postPage: number,
        postLimit: number,
        commentPage: number,
        commentLimit: number,
    ) {
        const user = await this.usersRepo.findOne({
            where: { id: userId },
        });

        const [posts, postCount] = await this.postsRepo.findAndCount({
            where: { authorId: userId },
            relations: ['files'],
            order: { id: 'DESC' },
            skip: (postPage - 1) * postLimit,
            take: postLimit,
        });

        const [comments, commentCount] = await this.commentsRepo.findAndCount({
            where: { authorId: userId },
            relations: ['post'],
            order: { id: 'DESC' },
            skip: (commentPage - 1) * commentLimit,
            take: commentLimit,
        });

        return {
            user,
            stats: {
                postCount,
                commentCount,
            },
            posts: {
                items: posts,
                total: postCount,
                currentPage: postPage,
                totalPages: Math.ceil(postCount / postLimit),
            },
            comments: {
                items: comments,
                total: commentCount,
                currentPage: commentPage,
                totalPages: Math.ceil(commentCount / commentLimit),
            },
        };
    }
}
