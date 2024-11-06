import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SourceMapAddDto } from './sourcemap.dto';
import { SourceMap } from './sourcemap.entity';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OSS = require('ali-oss');
@Injectable()
export class SourcemapService {
  constructor(
    @InjectRepository(SourceMap)
    private readonly sourcemapRepository: Repository<SourceMap>,
    private readonly config: ConfigService,
  ) {}
  OSS_Config = {
    region: this.config.get('OSS_REGION'),
    accessKeyId: this.config.get('OSS_ACCESS_KEY_ID'),
    accessKeySecret: this.config.get('OSS_ACCESS_KEY_SECRET'),
    bucket: this.config.get('OSS_BUCKET'),
  };
  client = new OSS(this.OSS_Config);
  headers = {
    // 指定该Object被下载时网页的缓存行为。
    'Cache-Control': 'no-cache',
    // 指定该Object被下载时的名称。
    // 'Content-Disposition': 'oss_download.txt',
    // 指定该Object被下载时的内容编码格式。
    'Content-Encoding': 'UTF-8',
    // 指定过期时间。
    // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定Object的访问权限。
    'x-oss-object-acl': 'private',
    // 设置Object的标签，可同时设置多个标签。
    // 'x-oss-tagging': 'Tag1=1&Tag2=2',
    // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': false,
  };
  add(data: SourceMapAddDto) {
    return this.sourcemapRepository.save(data);
  }
  addMany(data) {
    return this.sourcemapRepository.save(data);
  }
  deleteById(id: number) {
    return this.sourcemapRepository.delete({ id });
  }
  putBuffer(appId: string, name: string, buffer, headers = this.headers) {
    return this.client.put(
      `${this.config.get('OSS_SOURCEMAP_DIRNAME')}/${appId}/${name}`,
      buffer,
      headers,
    );
  }
}
