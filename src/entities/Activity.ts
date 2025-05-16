import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ nullable: true })
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;
}