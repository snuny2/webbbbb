import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
    ) {}

    // 회원가입용 아이디 비밀번호 중복검사
    async create(dto: CreateUserDto) {
        const exists = await this.usersRepo.exists({ where: { userId: dto.userId } });
        if (exists) {
            throw new ConflictException('이미 사용중인 아이디입니다.');
        }

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);

        const user = this.usersRepo.create({
            name: dto.name,
            userId: dto.userId,
            passwordHash,
        });

        try {
            const saved = await this.usersRepo.save(user);
            return {
                id: saved.id,
                name: saved.name,
                userId: saved.userId,
                createAt: saved.createAt,
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new InternalServerErrorException('회원가입 중 오류가 발생하였습니다.');
        }
    }

    async finByUserId(userId: string) {
        return this.usersRepo.findOne({
            where: { userId },
            select: { id: true, name: true, userId: true, passwordHash: true },
        });
    }

    // 로그인용 아이디 비밀번호 검사
    async findWithPassword(userId: string): Promise<User | null> {
        return this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.userId = :userId', { userId })
            .getOne();
    }

    async verifyPassword(plain: string, hash: string) {
        return bcrypt.compare(plain, hash);
    }
}
