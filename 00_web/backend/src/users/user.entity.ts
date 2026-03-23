import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['userId'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, comment: '이름' })
    name: string;

    @Column({ name: 'user_id', length: 30, comment: '로그인 아이디' })
    userId: string;

    @Column({ name: 'password_hash', length: 255, select: false })
    passwordHash: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
    isDeleted: any;
}
