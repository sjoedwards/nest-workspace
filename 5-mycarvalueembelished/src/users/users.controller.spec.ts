import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 123,
            email,
            password: 'test',
          } as User,
        ]);
      },
      // Course couldn't be bothered to set these up

      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      // Course couldn't be bothered to set these up
      // signup: () => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1 } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users returns users with the given emails', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('throws an error if user is not defined', async () => {
    // we don't have to reregister the module!
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns the user', async () => {
    const session: { userId?: number } = {};
    const user = await controller.signin(
      {
        email: 'test@test.com',
        password: 'test@test.com',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId);
  });
});
