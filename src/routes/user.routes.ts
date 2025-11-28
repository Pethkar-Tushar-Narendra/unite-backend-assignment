import { Router } from 'express';
import { authenticateJWT, AuthRequest } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';
import User from '../models/user.model';

const router = Router();

// 1. A route for any logged-in user to see their own profile
router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    // req.user is added by the authenticateJWT middleware
    const user = await User.findByPk(req.user?.id, {
      attributes: ['id', 'name', 'email', 'role'], // Exclude password
    });
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (error) {
    res.sendStatus(500);
  }
});

// 2. A route ONLY for admins
router.get(
  '/admin-dashboard',
  authenticateJWT,
  authorizeRoles('admin'),
  (req: AuthRequest, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user?.id}!` });
  },
);

export default router;
