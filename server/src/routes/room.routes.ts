import { Router } from 'express';
import { getRooms, getRoom, createRoom, updateRoom, deleteRoom, getAvailableRooms } from '../controllers/room.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public routes - no authentication needed
router.get('/available', getAvailableRooms);
router.get('/', getRooms);
router.get('/:id', getRoom);

// Protected routes - require authentication (admin or staff can modify rooms)
router.post('/', authenticateToken, requireRole('admin'), createRoom);
router.put('/:id', authenticateToken, requireRole('admin', 'staff'), updateRoom);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteRoom);

export default router;
