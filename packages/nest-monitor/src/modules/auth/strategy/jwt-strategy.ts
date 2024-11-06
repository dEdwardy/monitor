import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from '../auth.interface';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
// import { CacheService } from '../../cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService, // private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('access-token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload, done: VerifiedCallback) {
    console.log(
      'payload...........................................................',
      payload,
    );
    const { username } = payload;
    //通过帐号密码登录 pc
    const entity = await this.userService.findByName(username);
    // if (!entity) {
    //   //通过电话 邮箱 验证码登录 app h5
    //   const info = await this.cacheService.get(payload.email);
    //   if (info) done(null, info);
    //   done(new UnauthorizedException('未找到用户'));
    // }
    // if (!entity) done(new UnauthorizedException('帐号或密码错误'));
    // 相当于  return entity
    // done(null, entity);
    if (!entity) throw new UnauthorizedException('帐号或密码错误');
    return entity;
  }
}
