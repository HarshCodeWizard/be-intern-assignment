import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity('like')
export class Like {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}