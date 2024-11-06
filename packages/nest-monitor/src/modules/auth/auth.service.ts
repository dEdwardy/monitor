import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './auth.dto';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // private readonly cacheService: CacheService,
  ) {}
  signToken(data: JwtPayload) {
    console.log(data);
    return this.jwtService.sign(data);
  }

  async login(data: LoginDto) {
    const { username, password } = data;
    const entity = await this.userService.findByName(username, true);
    console.log('entity', entity);
    if (!entity) {
      // 用户名不存在
      throw new UnauthorizedException(
        new Error('用户名或密码错误'),
        '用户名或密码错误',
      );
    }
    if (!(await entity.comparePwd(password))) {
      // 密码错误
      throw new UnauthorizedException(
        new Error('用户名或密码错误'),
        '用户名或密码错误',
      );
    }
    const { id, email, role } = entity;
    const payload = { id, username, email, role };
    const token = this.signToken(payload);
    return {
      ...payload,
      token,
    };
  }
}
