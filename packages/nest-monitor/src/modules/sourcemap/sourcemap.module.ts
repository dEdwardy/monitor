import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourcemapController } from './sourcemap.controller';
import { SourceMap } from './sourcemap.entity';
import { SourcemapService } from './sourcemap.service';

@Module({
  imports: [ConfigService, TypeOrmModule.forFeature([SourceMap])],
  controllers: [SourcemapController],
  providers: [SourcemapService],
  exports: [SourcemapService],
})
export class SourcemapModule {}
