import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Role = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getRequest();
    return {
      role: res?.user?.role,
      userId: res?.user?.id,
    };
  },
);
