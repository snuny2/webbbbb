import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post as HttpPost,
    Query,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import express from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create_post.dto';
import { UpdatePostDto } from '../dto/update_post.dto';
import { createStoredFileName } from '../file/file.util';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('keyword') keyword = '',
        @Query('searchType') searchType = 'all',
    ) {
        return this.postsService.findAll(Number(page), Number(limit), keyword, searchType);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.postsService.findOne(id);
    }

    @Get(':id/edit')
    async findOneForEdit(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOneWithoutIncrease(id);
    }

    @HttpPost()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: '../uploads',
                filename: (_req, file, cb) => {
                    cb(null, createStoredFileName(file.originalname));
                },
            }),
        }),
    )
    async create(
        @Body() dto: CreatePostDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: express.Request,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        return this.postsService.create(dto, user, files || []);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePostDto,
        @Req() req: express.Request,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        return this.postsService.update(id, dto, user);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req: express.Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        return this.postsService.remove(id, user);
    }
}
