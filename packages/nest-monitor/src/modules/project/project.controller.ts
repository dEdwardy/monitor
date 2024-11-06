import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/core/decorator/user.decorator';
import { ProjectDto, ProjectQueryDto } from './project.dto';
import { ProjectService } from './project.service';

@Controller('project')
@ApiTags('project')
export class ProjectController {
  constructor(public projectService: ProjectService) {}

  @Get('/auth/:key')
  @ApiParam({ name: 'key', required: true })
  async getProjectIdByApiKey(@Param('key') apiKey) {
    console.log('apikey', apiKey);
    const res = await this.projectService.findOneByKey(apiKey);
    if (!res) throw new UnauthorizedException('Invalid ApiKey');
    return true;
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  add(@Body() data: ProjectDto) {
    if (data.id) {
      return this.projectService.updateProject(data);
    }
    return this.projectService.create(data);
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  getProById(@Param('id') id: string) {
    console.log('id', id);
    return this.projectService.findOneById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'access-token',
  })
  @ApiQuery({
    name: 'query',
    type: ProjectQueryDto,
  })
  getAll(@Query() query: ProjectQueryDto, @User() user) {
    return this.projectService.findAll(query, user);
  }

  @Delete()
  // @UseGuards(AuthGuard('jwt'))
  deleteProById(@Body('id') id: string) {
    return this.projectService.deleteById(id);
  }
}
