import { CreateTagDto } from './tag.dto';
import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagReposity: Repository<Tag>,
  ) {}
  createTag(tag: CreateTagDto) {
    return this.tagReposity.save(tag);
  }
  deleteTagById(id: number) {
    return this.tagReposity.delete(id);
  }
  async updateTagById(id, tag: Partial<CreateTagDto>) {
    const entity = await this.tagReposity.findOne(id);
    if (entity.name) entity.name = tag.name;
    if (entity.value) entity.value = tag.value;
    return await this.tagReposity.save(entity);
  }
  getAll() {
    return this.tagReposity.find({ select: ['id', 'name', 'value'] });
  }
}
