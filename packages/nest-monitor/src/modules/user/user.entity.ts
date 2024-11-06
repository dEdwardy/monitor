import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../project/project.entity';
import { UserRole } from 'src/core/interface/enums/user-role.enum';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: '主键' })
  id: string;

  @Column({ comment: '用户名', length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ comment: '密码', length: 50, select: false })
  password: string;

  @Column({ comment: '邮箱', length: 50, unique: true, select: true })
  email: string;

  @Column({ comment: '角色', update: false, default: UserRole.User })
  role: UserRole;

  @CreateDateColumn({ comment: '创建日期', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ comment: '修改日期', type: 'timestamp' })
  updatedDate: Date;

  @DeleteDateColumn({ comment: '删除时间', type: 'timestamp' })
  deleteDate: Date;

  @OneToMany(() => Project, (project) => project.principal)
  projects: Project;
  @BeforeUpdate()
  async comparePwd(pwd: string) {
    console.log(pwd);
    console.log(this.password);
    return pwd == this.password;
  }
}
