import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'
import { User } from '../entities/User';
import { Post } from '../entities/Post';

export class FeedController {
  async getFeed(req: Request, res: Response) {
    const { userId, limit = '10', offset = '0' } = req.query;
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);
  
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }
  
    const parsedUserId = parseInt(userId, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);
  
    if (isNaN(parsedUserId) || isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: 'Invalid userId, limit, or offset' });
    }
  
    const user = await userRepo.findOne({ where: { id: parsedUserId }, relations: ['following'] });
    if (!user) return res.status(404).json({ error: 'User not found' });
  
    const followingIds = user.following.map(f => f.id);
    const posts = await postRepo
      .createQueryBuilder('post')
      .where('post.userId IN (:...ids)', { ids: followingIds })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.likes', 'likes')
      .orderBy('post.createdAt', 'DESC')
      .skip(parsedOffset)
      .take(parsedLimit)
      .getMany();
  
    const formattedPosts = posts.map(post => ({
      content: post.content,
      author: { id: post.user.id, firstName: post.user.firstName, lastName: post.user.lastName },
      likeCount: post.likes.length,
      hashtags: post.hashtags,
    }));
  
    res.json(formattedPosts);
  }
}