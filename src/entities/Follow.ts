import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('follow')
export class Follow {
  @PrimaryColumn()
  followerId: number;

  @PrimaryColumn()
  followedId: number;

  @ManyToOne(() => User)
  follower: User;

  @ManyToOne(() => User)
  followed: User;

  @CreateDateColumn()
  createdAt: Date;
}