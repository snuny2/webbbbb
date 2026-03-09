import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create_user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signUp(dto: CreateUserDto): Promise<{
        success: boolean;
        user: {
            id: number;
            name: string;
            userId: string;
            createAt: Date;
        };
    }>;
}
