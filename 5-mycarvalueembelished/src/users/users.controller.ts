import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IRequest } from 'types/request';
import { JWTAuthGuard } from '../guards/jwt-auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
// Custom annotation applied to every route
@Serialize(UserDto)
export class UsersController {
  // This is dependency injected in
  constructor(private usersService: UsersService) {}

  @Get('/whoami')
  @UseGuards(JWTAuthGuard)
  whoAmI(@Request() request: IRequest) {
    return request.user;
  }

  // @Post('/signout')
  // async signout(@Session() session: any) {
  //   session.userId = null;
  // }

  // This is a string when it comes in
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('Handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/')
  findAllUsers(@Query('email') email: string) {
    console.log('ping');
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
