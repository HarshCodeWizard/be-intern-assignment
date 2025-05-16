import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema } from '../validations/postValidation';
import { PostController } from '../controllers/post.controller';

const router = Router();
const postController = new PostController();

router.get('/', postController.getAllPosts.bind(postController));
router.get('/:id', postController.getPostById.bind(postController));
router.post('/', validate(createPostSchema), postController.createPost.bind(postController));
router.put('/:id', validate(updatePostSchema), postController.updatePost.bind(postController));
router.delete('/:id', postController.deletePost.bind(postController));
router.get('/hashtag/:tag', postController.getPostsByHashtag.bind(postController));

export default router;