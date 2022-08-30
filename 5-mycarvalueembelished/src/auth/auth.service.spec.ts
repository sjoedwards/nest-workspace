import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.random() * 9999, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // Create fake module - useValue allows us to create a fake version of the usersService. UseValue is not type safe out of the box.
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    // Get service from DI container
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdfasd@test.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    // We can access the password here prior to the interceptor running - otherwise @serialize will strip it out!
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if email in use', async () => {
    await service.signup('test@test.com', 'test');

    await expect(service.signup('test@test.com', 'test')).rejects.toThrowError(
      'Email in use',
    );
  });

  it('throws if signin is used with an unused email', async () => {
    await expect(service.signin('test@test.com', 'test')).rejects.toThrowError(
      'user not found',
    );
  });

  it('throws if an invalid password is provided', async () => {
    // We don't have to call createTestingModule again!
    // fakeUsersService.find = async () =>
    //   Promise.resolve([
    //     {
    //       id: 'test',
    //       email: 'test@test.com',
    //       password: 'test',
    //     } as unknown as User,
    //   ]);

    await service.signup('test@test.com', 'test');

    await expect(service.signin('test@test.com', 'test1')).rejects.toThrowError(
      'Bad Password',
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'test');

    await expect(
      service.signin('test@test.com', 'test'),
    ).resolves.toBeDefined();
  });
});
