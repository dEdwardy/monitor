import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ description: 'username', required: true })
  readonly username: string;

  @ApiProperty({ description: 'password', required: true })
  readonly password: string;
}

export class AppLoginDto {
  readonly email: string;

  readonly code: string;
}
