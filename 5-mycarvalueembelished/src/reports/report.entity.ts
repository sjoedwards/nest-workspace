import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // Report table will add a new column on the reports table - user_id
  // Wrapped in a function because of CIRCULAR DEPENDENCIES between the relations
  // Can't directly make reference to the relation
  // Only at RUNTIME does the function get executed - at which point the circular dependency is gone
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
