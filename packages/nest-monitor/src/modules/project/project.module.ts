import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourcemapModule } from '../sourcemap/sourcemap.module';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), SourcemapModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
