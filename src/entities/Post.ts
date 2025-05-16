import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import { User } from './User';
  
  @Entity('posts')
  export class Post {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column({ type: 'varchar', length: 280 })
    content: string;
  
    @ManyToOne(() => User, user => user.id)
    user: User;
  
    @Column('simple-array')
    hashtags: string[];
  
    @ManyToMany(() => User)
    @JoinTable({
      name: 'like',
      joinColumn: { name: 'postId', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    likes: User[];
  
    @CreateDateColumn()
    createdAt: Date;
  }