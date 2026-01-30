import { Router } from 'express';
import { getRooms, getRoom, createRoom, updateRoom, deleteRoom, getAvailableRooms } from '../controllers/room.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes - no authentication needed
router.get('/available', getAvailableRooms);
router.get('/', getRooms);
router.get('/:id', getRoom);

// Protected routes - require authentication
router.post('/', authenticateToken, requireAdmin, createRoom);
router.put('/:id', authenticateToken, requireAdmin, updateRoom);
router.delete('/:id', authenticateToken, requireAdmin, deleteRoom);

export default router;
