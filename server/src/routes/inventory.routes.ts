import { Router } from 'express';
import {
    getStockMovements,
    getLowStockProducts,
    addStockMovement
} from '../controllers/inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/movements', authenticateToken, getStockMovements);
router.get('/low-stock', authenticateToken, getLowStockProducts);
router.post('/movements', authenticateToken, addStockMovement);

export default router;
