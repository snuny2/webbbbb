import { Controller, Get, Query, Req } from '@nestjs/common';
import express from 'express';
import { MypageService } from './mypage.service';

@Controller('mypage')
export class MypageController {
    constructor(private readonly mypageService: MypageService) {}

    @Get()
    async getMyPage(
        @Req() req: express.Request,
        @Query('postPage') postPage = '1',
        @Query('postLimit') postLimit = '8',
        @Query('commentPage') commentPage = '1',
        @Query('commentLimit') commentLimit = '5',
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;

        return this.mypageService.getMyPageData(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            user.sub,
            Number(postPage),
            Number(postLimit),
            Number(commentPage),
            Number(commentLimit),
        );
    }
}
