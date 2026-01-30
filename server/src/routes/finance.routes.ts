import { Router } from 'express';
import {
    getTransactions,
    createTransaction,
    getFinanceSummary
} from '../controllers/finance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getTransactions);
router.post('/', authenticateToken, createTransaction);
router.get('/summary', authenticateToken, getFinanceSummary);

export default router;
