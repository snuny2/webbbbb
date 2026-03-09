import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/users/dto/create_post.dto';
import { UpdatePostDto } from 'src/users/dto/update_post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(): Promise<import("./post.entity").Post[]>;
    findOne(id: number): Promise<import("./post.entity").Post>;
    create(dto: CreatePostDto, req: Request): Promise<import("./post.entity").Post>;
    update(id: number, dto: UpdatePostDto, req: Request): Promise<import("./post.entity").Post>;
    remove(id: number, req: Request): Promise<{
        message: string;
    }>;
}
