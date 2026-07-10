import {
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Req,
    Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import express from 'express';
import { join, normalize } from 'path';
import { existsSync } from 'fs';
import { PostFile } from './file.entity';

@Controller('files')
export class FilesController {
    constructor(
        @InjectRepository(PostFile)
        private readonly postFilesRepo: Repository<PostFile>,
    ) {}

    @Get(':id/view')
    async viewFile(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: express.Response,
        @Req() req: express.Request,
    ) {
        const file = await this.postFilesRepo.findOne({
            where: { id },
            relations: ['post'], // post 관계 로드
        });

        if (!file) {
            throw new NotFoundException('파일을 찾을 수 없습니다.');
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');

        // 소유권 검증 추가
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (file.post.authorId !== user.sub) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }

        const filePath = normalize(join(process.cwd(), file.filePath));

        if (!existsSync(filePath)) {
            throw new NotFoundException(`실제 파일이 존재하지 않습니다: ${filePath}`);
        }

        res.type(file.mimeType);
        return res.sendFile(filePath);
    }

    @Get(':id/download')
    async downloadFile(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: express.Response,
        @Req() req: express.Request,
    ) {
        const file = await this.postFilesRepo.findOne({
            where: { id },
            relations: ['post'], // post 관계 로드
        });

        if (!file) {
            throw new NotFoundException('파일을 찾을 수 없습니다.');
        }

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');

        // 소유권 검증 추가
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (file.post.authorId !== user.sub) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }

        const filePath = normalize(join(process.cwd(), file.filePath));

        if (!existsSync(filePath)) {
            throw new NotFoundException(`실제 파일이 존재하지 않습니다: ${filePath}`);
        }

        return res.download(filePath, file.originalName);
    }
}
