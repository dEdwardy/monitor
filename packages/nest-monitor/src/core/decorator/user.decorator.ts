import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getRequest();
    return res?.user;
  },
);
