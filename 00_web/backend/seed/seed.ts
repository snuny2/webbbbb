import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/user.entity';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
});

async function seed() {
    await AppDataSource.initialize();
    console.log('DB 연결 성공');

    const userRepository = AppDataSource.getRepository(User);

    const users = [
        {
            name: '관리자',
            userId: process.env.SEED_ADMIN_ID || 'admin',
            password: process.env.SEED_ADMIN_PASSWORD || 'admin1234',
        },
        {
            name: '테스트유저1',
            userId: 'test1',
            password: 'test1234',
        },
        {
            name: '테스트유저2',
            userId: 'test2',
            password: 'test1234',
        },
    ];

    for (const user of users) {
        const exists = await userRepository.findOne({
            where: { userId: user.userId },
        });

        if (!exists) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const newUser = userRepository.create({
                name: user.name,
                userId: user.userId,
                passwordHash: hashedPassword,
            });

            await userRepository.save(newUser);
            console.log(`✅ ${user.userId} 생성 완료`);
        } else {
            console.log(`⚠️ ${user.userId} 이미 존재함`);
        }
    }

    await AppDataSource.destroy();
    console.log('🎉 seed 완료');
}

seed().catch((error) => {
    console.error('seed 오류:', error);
});
