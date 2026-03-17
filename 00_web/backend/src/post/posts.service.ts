import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from 'src/dto/create_post.dto';
import { UpdatePostDto } from 'src/dto/update_post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostFile } from '../file/file.entity';
import { getFileFlags, normalizeOriginalFileName } from '../file/file.util';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepo: Repository<Post>,

        @InjectRepository(PostFile)
        private readonly postFilesRepo: Repository<PostFile>,
    ) {}

    async findAll(page: number, limit: number, keyword: string, searchType: string) {
        const query = this.postsRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.files', 'files')
            .orderBy('post.id', 'DESC');

        if (keyword && keyword.trim() !== '') {
            if (searchType === 'title') {
                query.andWhere('post.title LIKE :keyword', {
                    keyword: `%${keyword}%`,
                });
            } else if (searchType === 'content') {
                query.andWhere('post.content LIKE :keyword', {
                    keyword: `%${keyword}%`,
                });
            } else if (searchType === 'author') {
                query.andWhere('author.name LIKE :keyword', {
                    keyword: `%${keyword}%`,
                });
            } else {
                query.andWhere(
                    '(post.title LIKE :keyword OR post.content LIKE :keyword OR author.name LIKE :keyword)',
                    {
                        keyword: `%${keyword}%`,
                    },
                );
            }
        }

        query.skip((page - 1) * limit).take(limit);

        const [posts, total] = await query.getManyAndCount();

        return {
            items: posts,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit,
            keyword,
            searchType,
        };
    }

    async findOne(id: number) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: ['author', 'files'],
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        post.viewCount += 1;
        await this.postsRepo.save(post);

        return post;
    }

    async findOneWithoutIncrease(id: number) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: ['author', 'files'],
        });

        if (!post) {
            throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }

        return post;
    }

    async create(dto: CreatePostDto, user: any, files: Express.Multer.File[]) {
        const post = this.postsRepo.create({
            title: dto.title,
            content: dto.content,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            authorId: user.sub,
        });

        const savedPost = await this.postsRepo.save(post);

        if (files && files.length > 0) {
            const fileEntities = files.map((file) => {
                const flags = getFileFlags(file.mimetype);
                const originalName = normalizeOriginalFileName(file.originalname);

                return this.postFilesRepo.create({
                    postId: savedPost.id,
                    originalName,
                    storedName: file.filename,
                    filePath: `uploads/${file.filename}`,
                    mimeType: file.mimetype,
                    fileSize: file.size,
                    isPreviewable: flags.isPreviewable,
                    isImage: flags.isImage,
                    isVideo: flags.isVideo,
                });
            });

            await this.postFilesRepo.save(fileEntities);
        }

        return this.findOneWithoutIncrease(savedPost.id);
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
