import { HttpCode } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeleteUserDto, UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
// @UseGuards(AuthGuard())
@ApiTags('user')
export class UserController {
  constructor(public userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async addUser(@Body() user: UserDto) {
    return this.userService.addUser(user);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Delete()
  @ApiParam({ name: 'id', required: true })
  deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
