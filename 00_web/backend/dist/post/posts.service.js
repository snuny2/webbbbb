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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./post.entity");
let PostsService = class PostsService {
    postsRepo;
    constructor(postsRepo) {
        this.postsRepo = postsRepo;
    }
    async findAll() {
        return this.postsRepo.find({
            relations: ['author'],
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        post.viewCount += 1;
        await this.postsRepo.save(post);
        return post;
    }
    async findOneWithoutIncrease(id) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        return post;
    }
    async create(dto, user) {
        const post = this.postsRepo.create({
            title: dto.title,
            content: dto.content,
            authorId: user.sub,
        });
        return await this.postsRepo.save(post);
    }
    async update(id, dto, user) {
        const post = await this.postsRepo.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        if (post.authorId !== user.sub) {
            throw new common_1.ForbiddenException('수정 권한이 없습니다.');
        }
        post.title = dto.title;
        post.content = dto.content;
        return await this.postsRepo.save(post);
    }
    async remove(id, user) {
        const post = await this.postsRepo.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('게시글을 찾을 수 없습니다.');
        }
        if (post.authorId !== user.sub) {
            throw new common_1.ForbiddenException('삭제 권한이 없습니다.');
        }
        await this.postsRepo.remove(post);
        return { message: '게시글이 삭제되었습니다.' };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map