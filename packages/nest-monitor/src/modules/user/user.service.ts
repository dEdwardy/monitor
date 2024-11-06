import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userReposity: Repository<User>,
  ) {}

  async addUser(user: UserDto) {
    const { username, email, password } = await this.userReposity.save(user);
    console.log('password', password);
    return {
      username,
      email,
    };
  }
  deleteUserById(id: string) {
    return this.userReposity.delete({ id });
  }

  async findByName(username: string, password?: boolean): Promise<any> {
    const queryBuilder = await this.userReposity.createQueryBuilder('user');
    queryBuilder.where('user.username = :username', { username });

    if (password) {
      queryBuilder
        // .leftJoinAndSelect('user.roles', 'roles')
        .addSelect('user.password');
    }
    const entity = await queryBuilder.getOne();
    return entity;
  }

  getAll() {
    return this.userReposity.find();
  }
  verifyEmail(email) {
    return this.userReposity.findOne({ email });
  }
}
