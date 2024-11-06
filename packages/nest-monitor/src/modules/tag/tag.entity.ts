import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('increment', { comment: '主键' })
  id: number;

  @Column({ comment: '标签名', length: 50 })
  name: string;

  @Column({ comment: '标签值', length: 50, unique: true })
  value: string;

  @CreateDateColumn({ comment: '创建日期', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ comment: '修改日期', type: 'timestamp' })
  updatedDate: Date;
}
