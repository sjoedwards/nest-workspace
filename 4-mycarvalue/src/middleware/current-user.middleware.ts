import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

declare module 'express' {
  export interface Request {
    currentUser?: User;
  }
}

//TODO Note that in the docs, they do this in a passport / guard - maybe refactor
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }
    return next();
  }
}
