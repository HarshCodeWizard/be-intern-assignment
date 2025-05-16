import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Import AppDataSource
import { User } from '../entities/User';
import { Follow } from '../entities/Follow';
import { Activity } from '../entities/Activity';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User); // Use AppDataSource.getRepository
    const users = await userRepo.find();
    res.json(users);
  }

  async getUserById(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User); // Use AppDataSource.getRepository
    const user = await userRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  }

  async createUser(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User); // Use AppDataSource.getRepository
    const user = userRepo.create(req.body);
    await userRepo.save(user);
    res.status(201).json(user);
  }

  async updateUser(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User); // Use AppDataSource.getRepository
    const user = await userRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    userRepo.merge(user, req.body);
    await userRepo.save(user);
    res.json(user);
  }

  async deleteUser(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User); // Use AppDataSource.getRepository
    const result = await userRepo.delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  }

  async getUserFollowers(req: Request, res: Response) {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    const followRepo = AppDataSource.getRepository(Follow); // Use AppDataSource.getRepository
    const userRepo = AppDataSource.getRepository(User); // Use AppDataSource.getRepository

    const user = await userRepo.findOne({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followers = await followRepo.find({
      where: { followedId: Number(id) },
      relations: ['follower'],
      order: { createdAt: 'DESC' },
      skip: Number(offset),
      take: Number(limit),
    });

    const total = await followRepo.count({ where: { followedId: Number(id) } });
    const formattedFollowers = followers.map(f => ({
      id: f.follower.id,
      firstName: f.follower.firstName,
      lastName: f.follower.lastName,
    }));

    res.json({ followers: formattedFollowers, total });
  }

  async getUserActivity(req: Request, res: Response) {
    const { id } = req.params;
    const { limit = '10', offset = '0', type, startDate, endDate } = req.query;
    const activityRepo = AppDataSource.getRepository(Activity); // Use AppDataSource.getRepository

    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);

    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: 'Invalid limit or offset' });
    }

    let query = activityRepo
      .createQueryBuilder('activity')
      .where('activity.userId = :id', { id: Number(id) })
      .orderBy('activity.createdAt', 'DESC')
      .skip(parsedOffset)
      .take(parsedLimit);

    if (typeof type === 'string') query = query.andWhere('activity.type = :type', { type });
    if (typeof startDate === 'string') query = query.andWhere('activity.createdAt >= :startDate', { startDate });
    if (typeof endDate === 'string') query = query.andWhere('activity.createdAt <= :endDate', { endDate });

    const activities = await query.getMany();
    res.json(activities);
  }
}