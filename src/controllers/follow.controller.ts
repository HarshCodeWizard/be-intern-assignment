import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';
import { Activity } from '../entities/Activity';

export class FollowController {
  async getAllFollows(req: Request, res: Response) {
    const followRepo = AppDataSource.getRepository(Follow);
    const follows = await followRepo.find({ relations: ['follower', 'followed'] });
    res.json(follows);
  }

  async getFollowById(req: Request, res: Response) {
    const { followerId, followedId } = req.params;
    const followRepo = AppDataSource.getRepository(Follow);
    const follow = await followRepo.findOne({
      where: { followerId: Number(followerId), followedId: Number(followedId) },
      relations: ['follower', 'followed'],
    });
    if (!follow) return res.status(404).json({ error: 'Follow not found' });
    res.json(follow);
  }

  async createFollow(req: Request, res: Response) {
    const followRepo = AppDataSource.getRepository(Follow);
    const userRepo = AppDataSource.getRepository(User);
    const activityRepo = AppDataSource.getRepository(Activity);

    const follower = await userRepo.findOne({ where: { id: req.body.followerId } });
    const followed = await userRepo.findOne({ where: { id: req.body.followedId } });
    if (!follower || !followed) return res.status(404).json({ error: 'User not found' });

    const follow = followRepo.create({ followerId: req.body.followerId, followedId: req.body.followedId, follower, followed });
    await followRepo.save(follow);

    const activity = activityRepo.create({ user: follower, type: 'FOLLOW', targetId: followed.id });
    await activityRepo.save(activity);

    res.status(201).json(follow);
  }

  async deleteFollow(req: Request, res: Response) {
    const { followerId, followedId } = req.params;
    const followRepo = AppDataSource.getRepository(Follow);
    const userRepo = AppDataSource.getRepository(User);
    const activityRepo = AppDataSource.getRepository(Activity);

    const follower = await userRepo.findOne({ where: { id: Number(followerId) } });
    if (!follower) return res.status(404).json({ error: 'Follower not found' });

    const result = await followRepo.delete({ followerId: Number(followerId), followedId: Number(followedId) });
    if (result.affected === 0) return res.status(404).json({ error: 'Follow not found' });

    const activity = activityRepo.create({ user: follower, type: 'UNFOLLOW', targetId: Number(followedId) });
    await activityRepo.save(activity);

    res.status(204).send();
  }
}