import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  AfterUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleName } from '../../types/enums';
import { User } from './user.entity';

// By convention, you omit the 'Entity' suffix from the classname
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: RoleName;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];
}
