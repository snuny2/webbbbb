import {
    Injectable,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateProfileDto } from 'src/dto/update_user.dto';

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
            isActive: true,
        });

        const saved = await this.usersRepo.save(user);
        return { id: saved.id, name: saved.name, userId: saved.userId, createdAt: saved.createdAt };
    }

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

    async getProfile(userId: number) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });

        if (!user || !user.isActive) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return {
            id: user.id,
            name: user.name,
            userId: user.userId,
            createdAt: user.createdAt,
        };
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.id = :id', { id: userId })
            .getOne();

        if (!user || !user.isActive) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const passwordOk = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!passwordOk) {
            throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (dto.name) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            user.name = dto.name;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (dto.newPassword) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
        }

        const saved = await this.usersRepo.save(user);

        return {
            id: saved.id,
            name: saved.name,
            userId: saved.userId,
            updatedAt: saved.updatedAt,
        };
    }

    async withdraw(userId: number, currentPassword: string) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.id = :id', { id: userId })
            .getOne();

        if (!user || !user.isActive) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const passwordOk = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!passwordOk) {
            throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
        }

        user.isActive = false;
        user.deletedAt = new Date();
        user.passwordHash = await bcrypt.hash(`withdrawn-${Date.now()}-${user.id}`, 12);
        user.userId = `withdrawn_${user.id}_${Date.now()}`;
        user.name = '탈퇴한 회원';

        await this.usersRepo.save(user);

        return { message: '회원 탈퇴가 완료되었습니다.' };
    }
}
