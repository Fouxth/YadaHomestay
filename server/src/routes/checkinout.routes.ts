import { Router } from 'express';
import {
    getDailyCheckInOuts,
    performCheckIn,
    performCheckOut
} from '../controllers/checkinout.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/daily', authenticateToken, getDailyCheckInOuts);
router.post('/checkin', authenticateToken, performCheckIn);
router.post('/checkout', authenticateToken, performCheckOut);

export default router;
