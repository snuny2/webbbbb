import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateProfileDto } from 'src/dto/update_user.dto';
import express from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return { success: true, user };
    }

    @Get('profile')
    async getProfile(@Req() req: Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const profile = await this.usersService.getProfile(user.sub);
        return { success: true, profile };
    }

    @Patch('profile')
    async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const updated = await this.usersService.updateProfile(user.sub, dto);
        return { success: true, user: updated };
    }

    @Post('withdraw')
    async withdraw(
        @Req() req: Request,
        @Res({ passthrough: true }) res: express.Response,
        @Body() body: { currentPassword: string },
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const user = (req as any).user;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const result = await this.usersService.withdraw(user.sub, body.currentPassword);

        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });

        return { success: true, ...result };
    }
}
