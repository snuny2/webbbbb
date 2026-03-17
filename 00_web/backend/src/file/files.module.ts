import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostFile } from './file.entity';
import { FilesController } from './files.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PostFile])],
    controllers: [FilesController],
})
export class FilesModule {}
