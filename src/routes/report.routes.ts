import { Router } from 'express';
import {
  getDailySummary,
  getAgentPerformance,
  getInsights,
} from '../controllers/report.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/daily-summary', getDailySummary);
router.get('/agent-performance', getAgentPerformance);
router.get('/insights', getInsights);

export default router;
