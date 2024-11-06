import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';

@Controller('task')
@ApiTags('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('test')
  test() {
    return this.taskService.getCronJobs();
  }
  @Get('add')
  add() {
    return this.taskService.addCronJob('test', 50);
  }
}
