import { Controller, Get, NotFoundException, Param, ParseIntPipe, Res } from '@nestjs/common';
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
    async viewFile(@Param('id', ParseIntPipe) id: number, @Res() res: express.Response) {
        const file = await this.postFilesRepo.findOne({ where: { id } });

        if (!file) {
            throw new NotFoundException('파일을 찾을 수 없습니다.');
        }

        const filePath = normalize(join(process.cwd(), file.filePath));

        if (!existsSync(filePath)) {
            throw new NotFoundException(`실제 파일이 존재하지 않습니다: ${filePath}`);
        }

        res.type(file.mimeType);
        return res.sendFile(filePath);
    }

    @Get(':id/download')
    async downloadFile(@Param('id', ParseIntPipe) id: number, @Res() res: express.Response) {
        const file = await this.postFilesRepo.findOne({ where: { id } });

        if (!file) {
            throw new NotFoundException('파일을 찾을 수 없습니다.');
        }

        const filePath = normalize(join(process.cwd(), file.filePath));

        if (!existsSync(filePath)) {
            throw new NotFoundException(`실제 파일이 존재하지 않습니다: ${filePath}`);
        }

        return res.download(filePath, file.originalName);
    }
}
