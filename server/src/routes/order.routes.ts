import { Router } from 'express';
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - all order operations require authentication
router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrder);
router.post('/', authenticateToken, createOrder);
router.put('/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
