import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Activity } from '../entities/Activity';
import { ILike } from 'typeorm';

export class PostController {
  async getAllPosts(req: Request, res: Response) {
    const postRepo = AppDataSource.getRepository(Post);
    const posts = await postRepo.find({ relations: ['user', 'likes'] });
    res.json(posts);
  }

  async getPostById(req: Request, res: Response) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(req.params.id) }, relations: ['user', 'likes'] });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  }

  async createPost(req: Request, res: Response) {
    const postRepo = AppDataSource.getRepository(Post);
    const userRepo = AppDataSource.getRepository(User);
    const activityRepo = AppDataSource.getRepository(Activity);

    const user = await userRepo.findOne({ where: { id: req.body.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create a single Post entity
    const postData = { ...req.body, user } as Post; // Explicitly type as Post
    const savedPost = await postRepo.save(postData); // Save the single entity

    // Since we know savedPost is a single Post, we can safely access id
    const activity = activityRepo.create({ user, type: 'POST', targetId: savedPost.id });
    await activityRepo.save(activity);

    res.status(201).json(savedPost);
  }

  async updatePost(req: Request, res: Response) {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id: Number(req.params.id) } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    postRepo.merge(post, req.body);
    await postRepo.save(post);
    res.json(post);
  }

  async deletePost(req: Request, res: Response) {
    const postRepo = AppDataSource.getRepository(Post);
    const result = await postRepo.delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ error: 'Post not found' });
    res.status(204).send();
  }

  async getPostsByHashtag(req: Request, res: Response) {
    const { tag } = req.params;
    const { limit = '10', offset = '0' } = req.query;
    const postRepo = AppDataSource.getRepository(Post);

    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);

    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: 'Invalid limit or offset' });
    }

    const posts = await postRepo.find({
      where: { hashtags: ILike(`%${tag}%`) },
      relations: ['user', 'likes'],
      order: { createdAt: 'DESC' },
      skip: parsedOffset,
      take: parsedLimit,
    });

    const formattedPosts = posts.map(post => ({
      content: post.content,
      author: { id: post.user.id, firstName: post.user.firstName, lastName: post.user.lastName },
      likeCount: post.likes.length,
    }));

    res.json(formattedPosts);
  }
}