import { Router } from 'express';
import { getAuditLogs, getAuditStats } from '../controllers/audit.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All audit routes require admin authentication
router.get('/', authenticateToken, requireAdmin, getAuditLogs);
router.get('/stats', authenticateToken, requireAdmin, getAuditStats);

export default router;
