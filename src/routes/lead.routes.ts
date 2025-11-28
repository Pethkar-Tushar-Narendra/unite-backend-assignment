import { Router } from 'express';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller';
import {
  validateCreateLead,
  validateUpdateLead,
} from '../validators/lead.validator';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateJWT);

// POST /leads - Create new lead
router.post('/', validateCreateLead, createLead);

// GET /leads - Get all leads
router.get('/', getAllLeads);

// GET /leads/:id - Get single lead
router.get('/:id', getLeadById);

// PUT /leads/:id - Update lead
router.put('/:id', validateUpdateLead, updateLead);

// DELETE /leads/:id - Delete lead
router.delete('/:id', deleteLead);

export default router;
