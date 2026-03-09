import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create_user.dto';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        return { success: true, user };
    }
}
