import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/users/dto/create_post.dto';
import { UpdatePostDto } from 'src/users/dto/update_post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,
    ) {}

    async findAll() {
        return this.postsRepo.find({
            relations: ['author'],
            order: { id: 'DESC' },
        });
    }

    async findNum(id: number) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: ['author'],
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        post.viewCount += 1;
        await this.postsRepo.save(post);

        return post;
    }

    async create(dto: CreatePostDto, user: any) {
        const post = this.postsRepo.create({
            title: dto.title,
            content: dto.content,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            authorId: user.sub,
        });

        return this.postsRepo.save(post);
    }

    async findOneWithoutIncrease(id: number) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: ['author'],
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        return post;
    }

    async update(id: number, dto: UpdatePostDto, user: any) {
        const post = await this.postsRepo.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (post.authorId !== user.sub) {
            throw new ForbiddenException('수정 권한이 없습니다.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        post.title = dto.title;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        post.content = dto.content;

        return await this.postsRepo.save(post);
    }

    async remove(id: number, user: any) {
        const post = await this.postsRepo.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (post.authorId !== user.sub) {
            throw new ForbiddenException('삭제 권한이 없습니다.');
        }

        await this.postsRepo.remove(post);

        return { message: '게시글이 삭제되었습니다.' };
    }
}
