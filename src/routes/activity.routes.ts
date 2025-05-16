import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { activitySchema } from '../validations/activityValidation';
import { ActivityController } from '../controllers/activity.controller';

const router = Router();
const activityController = new ActivityController();

router.get('/', activityController.getAllActivities.bind(activityController));
router.get('/:id', activityController.getActivityById.bind(activityController));
router.post('/', validate(activitySchema), activityController.createActivity.bind(activityController));
router.put('/:id', validate(activitySchema), activityController.updateActivity.bind(activityController));
router.delete('/:id', activityController.deleteActivity.bind(activityController));

export default router;