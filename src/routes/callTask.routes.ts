import { Router } from 'express';
import {
  createCallTask,
  completeCallTask,
  getAllCallTasks,
} from '../controllers/callTask.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', createCallTask);
router.put('/:id/complete', completeCallTask);
router.get('/', getAllCallTasks);

export default router;
