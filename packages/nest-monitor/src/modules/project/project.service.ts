import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/core/interface/enums/user-role.enum';
import { Repository, Like } from 'typeorm';
import { SourcemapService } from '../sourcemap/sourcemap.service';
import { ProjectDto, ProjectQueryDto } from './project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly sourcemapService: SourcemapService,
  ) {}
  async create(project: ProjectDto) {
    if (project.sourcemaps.length > 0) {
      project.sourcemaps = await this.sourcemapService.addMany(
        project.sourcemaps,
      );
    }
    const entity = this.projectRepository.create(project);
    // return this.projectRepository.save(project);
    return this.projectRepository.save(entity);
  }
  async updateProject(project: ProjectDto) {
    const entity = await this.projectRepository.findOne({ id: project.id });
    // if (project.sourcemaps && project.sourcemaps.length > 0) {
    //   const sourceMaps = await this.sourcemapService.addMany(
    //     project.sourcemaps,
    //   );
    //   entity.sourcemaps = sourceMaps;
    // }
    entity.sourcemaps = project.sourcemaps;
    entity.desc = project.desc;
    return this.projectRepository.save(entity);
  }
  async findAll(
    query: ProjectQueryDto = {},
    user: { role: UserRole; id: string },
  ) {
    if (user.role === UserRole.User) query.principal = user.id;
    Object.keys(query).map((key) => {
      if (!query[key]) delete query[key];
    });
    console.log('query', query);
    return await this.projectRepository.find({
      where: {
        ...query,
        name: Like(query.name ? `%${query.name}%` : '%%'),
      },
      relations: ['principal'],
      order: {
        createdDate: 'DESC',
      },
    });
  }
  async findOneByUser(principal) {
    return await this.projectRepository.findOne({
      principal,
    });
  }
  async findOneByKey(apiKey) {
    return await this.projectRepository.findOne({
      apiKey,
    });
  }
  async findOneById(id) {
    return await this.projectRepository.findOne(id, {
      relations: ['sourcemaps'],
    });
  }

  async deleteById(id: string) {
    // return await this.projectRepository.delete(id);
    return await this.projectRepository.softDelete(id);
  }
}
