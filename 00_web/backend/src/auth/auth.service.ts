import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwt: JwtService,
    ) {}

    async login(userId: string, password: string) {
        const user = await this.usersService.findWithPassword(userId);

        if (!user || !user.isActive) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
        }

        const ok = await this.usersService.verifyPassword(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('아이디 또는 비밀번호가 틀립니다.');

        const payload = { sub: user.id, userId: user.userId, name: user.name };

        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
        });

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
        });

        return {
            user: { id: user.id, name: user.name, userId: user.userId },
            accessToken,
            refreshToken,
        };
    }

    async regresh(token: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const decoded = await this.jwt.verifyAsync(token).catch(() => null);
        if (!decoded) {
            // ← 이 체크 추가
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const payload = { sub: decoded.sub, userId: decoded.userId, name: decoded.name };
        const accessToken = await this.jwt.signAsync(payload, { expiresIn: 60 * 15 });
        return { accessToken };
    }
}
