import { Router } from 'express';
import {
  uploadCSV,
  uploadCSVMiddleware,
  getCSVLogs,
} from '../controllers/csv.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/upload', uploadCSVMiddleware, uploadCSV);
router.get('/logs', getCSVLogs);

export default router;
