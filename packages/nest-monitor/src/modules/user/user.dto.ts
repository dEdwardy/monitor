import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty({ description: 'username', required: true })
  username: string;
  @ApiProperty({ description: 'password', required: true })
  password: string;
  @ApiProperty({ description: 'email', required: false })
  email: string;
}

export class DeleteUserDto {
  @ApiProperty({ description: 'id', required: true })
  id: string;
}
