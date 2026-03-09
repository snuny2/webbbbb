"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwt;
    constructor(usersService, jwt) {
        this.usersService = usersService;
        this.jwt = jwt;
    }
    async login(userId, password) {
        const user = await this.usersService.findWithPassword(userId);
        if (!user)
            throw new common_1.UnauthorizedException('아이디 또는 비밀번호가 틀립니다.');
        const ok = await this.usersService.verifyPassword(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('아이디 또는 비밀번호가 틀립니다.');
        const payload = { sub: user.id, userId: user.userId, name: user.name };
        const accessToken = await this.jwt.signAsync(payload, { expiresIn: 60 * 15 });
        const refreshToken = await this.jwt.signAsync(payload, { expiresIn: 60 * 60 * 24 * 7 });
        return {
            user: { id: user.id, name: user.name, userId: user.userId },
            accessToken,
            refreshToken,
        };
    }
    async regresh(token) {
        const decoded = await this.jwt.verifyAsync(token).catch(() => null);
        const payload = { sub: decoded.sub, userId: decoded.userId, name: decoded.name };
        const accessToken = await this.jwt.signAsync(payload, { expiresIn: 60 * 15 });
        return { accessToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map