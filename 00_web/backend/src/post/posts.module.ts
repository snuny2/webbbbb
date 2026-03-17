import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostFile } from '../file/file.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostFile])],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
