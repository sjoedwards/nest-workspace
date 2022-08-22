import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// By convention, you omit the 'Entity' suffix from the classname
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
