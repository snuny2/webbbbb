import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './post/posts.module';
import { jwtMiddleware } from './auth/jwt.middleware';
import { Post } from './post/post.entity';
import { MeController } from './me.controller';
import { Comment } from './post/comments/comment.entity';
import { CommentsModule } from './post/comments/comment.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 3306),
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '1234',
            database: process.env.DB_NAME || 'myappdb',
            entities: [User, Post, Comment],
            synchronize: true, // 개발은 true 운영은 migration
            charset: 'utf8mb4',
        }),
        UsersModule,
        AuthModule,
        PostsModule,
        CommentsModule,
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
            );
    }
}
