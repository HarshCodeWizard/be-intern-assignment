import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'
import { Activity } from '../entities/Activity';
import { User } from '../entities/User';

export class ActivityController {
  async getAllActivities(req: Request, res: Response) {
    const activityRepo = AppDataSource.getRepository(Activity);
    const activities = await activityRepo.find({ relations: ['user'] });
    res.json(activities);
  }

  async getActivityById(req: Request, res: Response) {
    const activityRepo = AppDataSource.getRepository(Activity);
    const activity = await activityRepo.findOne({ where: { id: Number(req.params.id) }, relations: ['user'] });
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  }

  async createActivity(req: Request, res: Response) {
    
    
    const activityRepo = AppDataSource.getRepository(Activity);
    const userRepo = AppDataSource.getRepository(User);
  
    const user = await userRepo.findOne({ where: { id: req.body.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
  
    const activity = activityRepo.create({ ...req.body, user });
    await activityRepo.save(activity);
    res.status(201).json(activity);
  }

  async updateActivity(req: Request, res: Response) {
    const activityRepo = AppDataSource.getRepository(Activity);
    const activity = await activityRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    activityRepo.merge(activity, req.body);
    await activityRepo.save(activity);
    res.json(activity);
  }

  async deleteActivity(req: Request, res: Response) {
    const activityRepo = AppDataSource.getRepository(Activity);
    const result = await activityRepo.delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ error: 'Activity not found' });
    res.status(204).send();
  }
}