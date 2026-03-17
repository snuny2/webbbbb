import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('post_files')
export class PostFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'post_id' })
    postId: number;

    @Column({ name: 'original_name' })
    originalName: string;

    @Column({ name: 'stored_name' })
    storedName: string;

    @Column({ name: 'file_path' })
    filePath: string;

    @Column({ name: 'mime_type' })
    mimeType: string;

    @Column({ name: 'file_size', type: 'bigint' })
    fileSize: number;

    @Column({ name: 'is_previewable', default: false })
    isPreviewable: boolean;

    @Column({ name: 'is_image', default: false })
    isImage: boolean;

    @Column({ name: 'is_video', default: false })
    isVideo: boolean;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;
}
