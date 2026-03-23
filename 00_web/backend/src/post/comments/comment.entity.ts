import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Post } from '../post.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'author_id' })
    authorId: number;

    @Column({ name: 'post_id' })
    postId: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
