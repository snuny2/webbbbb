import { Controller, Get, Req } from '@nestjs/common';
import express from 'express';

@Controller()
export class MeController {
    @Get('me')
    me(@Req() req: express.Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return { user: (req as any).user };
    }
}
