import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'
import { Like } from '../entities/Like';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Activity } from '../entities/Activity';

export class LikeController {
  async getAllLikes(req: Request, res: Response) {
    const likeRepo = AppDataSource.getRepository(Like);
    const likes = await likeRepo.find({ relations: ['user', 'post'] });
    res.json(likes);
  }

  async getLikeById(req: Request, res: Response) {
    const { userId, postId } = req.params;
    const likeRepo = AppDataSource.getRepository(Like);
    const like = await likeRepo.findOne({
      where: { userId: Number(userId), postId: Number(postId) },
      relations: ['user', 'post'],
    });
    if (!like) return res.status(404).json({ error: 'Like not found' });
    res.json(like);
  }

  async createLike(req: Request, res: Response) {
    const likeRepo = AppDataSource.getRepository(Like);
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);
    const activityRepo = AppDataSource.getRepository(Activity);

    const user = await userRepo.findOne({ where: { id: req.body.userId } });
    const post = await postRepo.findOne({ where: { id: req.body.postId } });
    if (!user || !post) return res.status(404).json({ error: 'User or Post not found' });

    const like = likeRepo.create({ userId: req.body.userId, postId: req.body.postId, user, post });
    await likeRepo.save(like);

    const activity = activityRepo.create({ user, type: 'LIKE', targetId: post.id });
    await activityRepo.save(activity);

    res.status(201).json(like);
  }

  async deleteLike(req: Request, res: Response) {
    const { userId, postId } = req.params;
    const likeRepo = AppDataSource.getRepository(Like);
    const userRepo = AppDataSource.getRepository(User);
    const activityRepo = AppDataSource.getRepository(Activity);
  
    const user = await userRepo.findOne({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
  
    const result = await likeRepo.delete({ userId: Number(userId), postId: Number(postId) });
    if (result.affected === 0) return res.status(404).json({ error: 'Like not found' });
  
    const activity = activityRepo.create({ user, type: 'UNLIKE', targetId: Number(postId) });
    await activityRepo.save(activity);
  
    res.status(204).send();
  }
}