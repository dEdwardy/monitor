import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { SourcemapService } from './sourcemap.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
@Controller('sourcemap')
@ApiTags('sourcemap')
export class SourcemapController {
  constructor(private readonly sourcemapService: SourcemapService) {}
  logger = new Logger(SourcemapController.name);
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSourceMap(@UploadedFile() file, @Headers('appid') appId: string) {
    const { name, url } = await this.sourcemapService.putBuffer(
      appId,
      file?.originalname,
      file.buffer,
    );
    // await this.sourcemapService.add({ name, url });
    return {
      name,
      url,
    };
  }
}
