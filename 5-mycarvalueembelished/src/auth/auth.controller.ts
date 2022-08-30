import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

import { User } from '../users/user.entity';

interface IRequest extends Request {
  user?: User;
}

@Controller('auth')
// Custom annotation applied to every route
export class AuthController {
  // This is dependency injected in
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    const jwt = await this.authService.generateJwt(user);

    return jwt;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@Request() request: IRequest) {
    return this.authService.generateJwt(request.user);
  }
}
