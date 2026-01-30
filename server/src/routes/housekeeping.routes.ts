import { Router } from 'express';
import {
    getHousekeepingStatus,
    updateRoomStatus,
    markRoomCleaned,
    markRoomMaintenance,
    completeMaintenance
} from '../controllers/housekeeping.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All housekeeping routes require authentication
router.get('/', authenticateToken, getHousekeepingStatus);
router.put('/rooms/:id/status', authenticateToken, updateRoomStatus);
router.post('/rooms/:id/cleaned', authenticateToken, markRoomCleaned);
router.post('/rooms/:id/maintenance', authenticateToken, markRoomMaintenance);
router.post('/rooms/:id/maintenance/complete', authenticateToken, completeMaintenance);

export default router;
