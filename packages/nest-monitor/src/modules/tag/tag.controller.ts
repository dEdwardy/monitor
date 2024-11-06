import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTagDto, UpdateTagDto } from './tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
@ApiTags('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  create(@Body() tag: CreateTagDto) {
    return this.tagService.createTag(tag);
  }
  @Get()
  getAll() {
    return this.tagService.getAll();
  }
  @Put()
  update(@Body() tagDto: UpdateTagDto) {
    const { id, ...tag } = tagDto;
    return this.tagService.updateTagById(id, tag);
  }
  @Delete(':id')
  @ApiParam({ name: 'id' })
  delete(@Param('id') id: number) {
    return this.tagService.deleteTagById(id);
  }
}
