import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';

const router = Router();
const feedController = new FeedController();

router.get('/', feedController.getFeed.bind(feedController));

export default router;