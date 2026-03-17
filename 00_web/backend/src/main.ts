import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }),
    );
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useStaticAssets(join(process.cwd(), 'uploads'), {
        prefix: '/uploads',
    });

    await app.listen(4000);
}
bootstrap();
