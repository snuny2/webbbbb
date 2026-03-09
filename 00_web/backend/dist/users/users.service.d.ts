import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    create(dto: CreateUserDto): Promise<{
        id: number;
        name: string;
        userId: string;
        createAt: Date;
    }>;
    finByUserId(userId: string): Promise<User | null>;
    findWithPassword(userId: string): Promise<User | null>;
    verifyPassword(plain: string, hash: string): Promise<boolean>;
}
