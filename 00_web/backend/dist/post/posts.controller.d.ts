import express from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create_post.dto';
import { UpdatePostDto } from '../dto/update_post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(page?: string, limit?: string): Promise<{
        items: import("./post.entity").Post[];
        total: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    }>;
    findOne(id: number): Promise<import("./post.entity").Post>;
    findOneForEdit(id: number): Promise<import("./post.entity").Post>;
    create(dto: CreatePostDto, req: express.Request): Promise<import("./post.entity").Post>;
    update(id: number, dto: UpdatePostDto, req: express.Request): Promise<import("./post.entity").Post>;
    remove(id: number, req: express.Request): Promise<{
        message: string;
    }>;
}
