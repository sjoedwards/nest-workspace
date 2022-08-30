import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hash and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    return user;
  }

  async validateUser(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      return null;
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      return null;
    }
    return user;
  }

  async generateJwt(user: User) {
    return { access_token: this.jwtService.sign({ sub: user.id }) };
  }
}
