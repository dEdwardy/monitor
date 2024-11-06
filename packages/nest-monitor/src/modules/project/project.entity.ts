import { nanoid } from 'nanoid';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  DeleteDateColumn,
} from 'typeorm';
import { SourceMap } from '../sourcemap/sourcemap.entity';
import { User } from '../user/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'ApiKey',
    unique: true,
    update: false,
    select: false,
  })
  apiKey: string;

  //注意 直接repository.save 不会触发beforeInsert 需要先entity = repository.create(data) 然后 repository.save（entity）
  @BeforeInsert()
  setApiKey() {
    this.apiKey = nanoid(24);
  }

  @Column({ comment: '项目名', nullable: false })
  name: string;

  @Column({ comment: '负责人邮件', nullable: false })
  email: string;

  @Column({ comment: '描述', nullable: true })
  desc: string;

  @CreateDateColumn({ comment: '创建日期', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ comment: '修改日期', type: 'timestamp' })
  updatedDate: Date;

  @DeleteDateColumn({ comment: '删除日期', type: 'timestamp' })
  deleteDate: Date;

  // @Column({ comment: 'SourceMap', nullable: true, default: [] })
  @OneToMany(() => SourceMap, (sourcemap) => sourcemap.project, {
    cascade: true,
  })
  sourcemaps: SourceMap[];

  @ManyToOne(() => User, (user) => user.projects)
  principal: string;
}
