import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user')
@Unique(['userId'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, comment: '이름' })
    name: string;

    @Column({ name: 'user_id', length: 30, comment: '로그인 아이디' })
    userId: string;

    // 비밀번호 헤시로 저장
    @Column({ name: 'password_hash', length: 255, select: false })
    passwordHash: string;

    @CreateDateColumn({ name: 'create_at' })
    createAt: Date;

    @UpdateDateColumn({ name: 'update_at' })
    updateAt: Date;
}
