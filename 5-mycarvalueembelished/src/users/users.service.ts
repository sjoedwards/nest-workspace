import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  // Injects the repository from typeorm
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private configService: ConfigService,
  ) {}
  create(email: string, password: string) {
    // Creates an instance in memory
    const user = this.repo.create({ email, password });

    // Creates it in the database
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException();
    }
    const user = await this.repo.findOne({
      where: { id },
    });

    return user;
  }

  find(email: string) {
    console.log(this.configService.get('DB_NAME'));
    return this.repo.findBy({ email });
  }

  async findById(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
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
