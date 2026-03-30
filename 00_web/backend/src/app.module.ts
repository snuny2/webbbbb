import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './post/posts.module';
import { jwtMiddleware } from './auth/jwt.middleware';
import { Post } from './post/post.entity';
import { MeController } from './me.controller';
import { Comment } from './post/comments/comment.entity';
import { CommentsModule } from './post/comments/comment.module';
import { PostFile } from './file/file.entity';
import { FilesModule } from './file/files.module';
import { MypageModule } from './mypage/mypage.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [User, Post, Comment, PostFile],
            synchronize: true, // 개발은 true 운영은 migration
            charset: 'utf8mb4',
        }),
        UsersModule,
        AuthModule,
        PostsModule,
        CommentsModule,
        FilesModule,
        MypageModule,
    ],
    controllers: [MeController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(jwtMiddleware)
            .forRoutes(
                { path: 'posts', method: RequestMethod.POST },
                { path: 'posts/:id', method: RequestMethod.PATCH },
                { path: 'posts/:id', method: RequestMethod.DELETE },
                { path: 'me', method: RequestMethod.GET },
                { path: 'posts/:postId/comments', method: RequestMethod.POST },
                { path: 'comments/:commentId', method: RequestMethod.DELETE },
                { path: 'mypage', method: RequestMethod.GET },
                { path: 'users/profile', method: RequestMethod.GET },
                { path: 'users/profile', method: RequestMethod.PATCH },
                { path: 'users/withdraw', method: RequestMethod.POST },
            );
    }
}
