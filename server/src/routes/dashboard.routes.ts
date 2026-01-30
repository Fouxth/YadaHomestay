import { Router } from 'express';
import { getStats, getRevenueReport, getOccupancyReport } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.get('/stats', authenticateToken, getStats);
router.get('/revenue', authenticateToken, getRevenueReport);
router.get('/occupancy', authenticateToken, getOccupancyReport);

export default router;
