import { IsEmail, IsNotEmpty } from 'class-validator';
import { SourceMap } from '../sourcemap/sourcemap.entity';
export class ProjectDto {
  id?: string;

  @IsNotEmpty({ message: '项目名不能为空' })
  name?: string;

  @IsNotEmpty({ message: '负责人不能为空' })
  principal?: string;

  @IsEmail({}, { message: '邮件格式错误' })
  @IsNotEmpty({ message: '负责人邮件不能为空' })
  email?: string;

  sourcemaps?: SourceMap[];

  desc?: string;
}

export class ProjectQueryDto {
  name?: string;
  principal?: string;
  desc?: string;
  createdDate?: string;
}
