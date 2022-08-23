import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // Injects the repository from typeorm
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    // Creates an instance in memory
    const user = this.repo.create({ email, password });

    // Creates it in the database
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException();
    }
    const user = this.repo.findOneBy({ id });

    return user;
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    // Update is designed to be used with plain objects - so we want to use Save!
    // To call save we need to get an entity
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new Error('user not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    // Delete is designed to be used with plain objects - so we want to use Remove!
    // To call remove we need to get an entity
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new Error('user not found');
    }

    return this.repo.remove(user);
  }
}
