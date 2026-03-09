import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwt;
    constructor(usersService: UsersService, jwt: JwtService);
    login(userId: string, password: string): Promise<{
        user: {
            id: number;
            name: string;
            userId: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    regresh(token: string): Promise<{
        accessToken: string;
    }>;
}
