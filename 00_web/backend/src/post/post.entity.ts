import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OneToMany } from 'typeorm';
import { PostFile } from '../file/file.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'author_id' })
    authorId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column({ name: 'view_count', default: 0 })
    viewCount: number;

    @CreateDateColumn({ name: 'create' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => PostFile, (postFile) => postFile.post)
    files: PostFile[];
}
