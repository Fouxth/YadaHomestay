import { Router } from 'express';
import {
    getMaintenanceTasks,
    createMaintenanceTask,
    updateMaintenanceTask,
    assignMaintenanceTask
} from '../controllers/maintenance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getMaintenanceTasks);
router.post('/', authenticateToken, createMaintenanceTask);
router.put('/:id', authenticateToken, updateMaintenanceTask);
router.put('/:id/assign', authenticateToken, assignMaintenanceTask);

export default router;
