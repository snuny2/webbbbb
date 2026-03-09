import { User } from '../users/user.entity';
export declare class Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    author: User;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
