import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, updateProfile } from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.get('/', authenticateToken, requireAdmin, getUsers);
router.get('/:id', authenticateToken, getUser);
router.post('/', authenticateToken, requireAdmin, createUser);
router.put('/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

// Profile update (for current user)
router.put('/profile/update', authenticateToken, updateProfile);

export default router;
