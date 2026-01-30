import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, updateProfile } from '../controllers/user.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - allow both admin and staff to view users
router.get('/', authenticateToken, requireRole('admin', 'staff'), getUsers);
router.get('/:id', authenticateToken, requireRole('admin', 'staff'), getUser);
router.post('/', authenticateToken, requireRole('admin'), createUser);
router.put('/:id', authenticateToken, requireRole('admin'), updateUser);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

// Profile update (for current user)
router.put('/profile/update', authenticateToken, updateProfile);

export default router;
