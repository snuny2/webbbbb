"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./users/user.entity");
const auth_module_1 = require("./auth/auth.module");
const posts_module_1 = require("./post/posts.module");
const jwt_middleware_1 = require("./auth/jwt.middleware");
const post_entity_1 = require("./post/post.entity");
const me_controller_1 = require("./me.controller");
const comment_entity_1 = require("./post/comments/comment.entity");
const comment_module_1 = require("./post/comments/comment.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(jwt_middleware_1.jwtMiddleware)
            .forRoutes({ path: 'posts', method: common_1.RequestMethod.POST }, { path: 'posts/:id', method: common_1.RequestMethod.PATCH }, { path: 'posts/:id', method: common_1.RequestMethod.DELETE }, { path: 'me', method: common_1.RequestMethod.GET }, { path: 'posts/:postId/comments', method: common_1.RequestMethod.POST }, { path: 'comments/:commentId', method: common_1.RequestMethod.DELETE });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT || 3306),
                username: process.env.DB_USER || 'root',
                password: process.env.DB_PASS || '1234',
                database: process.env.DB_NAME || 'myappdb',
                entities: [user_entity_1.User, post_entity_1.Post, comment_entity_1.Comment],
                synchronize: true,
                charset: 'utf8mb4',
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            posts_module_1.PostsModule,
            comment_module_1.CommentsModule,
        ],
        controllers: [me_controller_1.MeController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map