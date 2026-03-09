import { CreatePostDto } from 'src/dto/create_post.dto';
import { UpdatePostDto } from 'src/dto/update_post.dto';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
export declare class PostsService {
    private readonly postsRepo;
    constructor(postsRepo: Repository<Post>);
    findAll(): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    findOneWithoutIncrease(id: number): Promise<Post>;
    create(dto: CreatePostDto, user: any): Promise<Post>;
    update(id: number, dto: UpdatePostDto, user: any): Promise<Post>;
    remove(id: number, user: any): Promise<{
        message: string;
    }>;
}
