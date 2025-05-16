import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { likeSchema } from '../validations/likeValidation';
import { LikeController } from '../controllers/like.controller';

const router = Router();
const likeController = new LikeController();

router.get('/', likeController.getAllLikes.bind(likeController));
router.get('/:userId/:postId', likeController.getLikeById.bind(likeController));
router.post('/', validate(likeSchema), likeController.createLike.bind(likeController));
router.delete('/:userId/:postId', likeController.deleteLike.bind(likeController));

export default router;