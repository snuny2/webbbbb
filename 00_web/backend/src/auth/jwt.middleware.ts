import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class jwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    use(req: Request, _res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const token = req.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('로그인이 필요합니다.');
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const payload = this.jwtService.verify(token);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            (req as any).user = payload;
            next();
        } catch {
            throw new UnauthorizedException('유효하지 않은 접근입니다.');
        }
    }
}
