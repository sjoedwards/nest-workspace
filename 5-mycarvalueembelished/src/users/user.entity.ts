import { Report } from '../reports/report.entity';
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
import { Role } from './role.entity';

// By convention, you omit the 'Entity' suffix from the classname
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  @OneToMany(() => Report, (report) => report.user, { lazy: true })
  reports: Report[];

  // Will run after insertion to the database
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  // Will run after update to entity in the database
  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id ', this.id);
  }

  // Will run after removal to entity in the database
  @AfterRemove()
  logRemove() {
    console.log('Removed user with id ', this.id);
  }
}
