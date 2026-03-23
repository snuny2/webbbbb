import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';
import { User } from '../users/user.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../post/comments/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Comment])],
    controllers: [MypageController],
    providers: [MypageService],
})
export class MypageModule {}
