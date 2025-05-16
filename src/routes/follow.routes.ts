import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { followSchema } from '../validations/followValidation';
import { FollowController } from '../controllers/follow.controller';

const router = Router();
const followController = new FollowController();

router.get('/', followController.getAllFollows.bind(followController));
router.get('/:followerId/:followedId', followController.getFollowById.bind(followController));
router.post('/', validate(followSchema), followController.createFollow.bind(followController));
router.delete('/:followerId/:followedId', followController.deleteFollow.bind(followController));

export default router;