import { Router } from 'express';
import {
    getCleaningTasks,
    createCleaningTask,
    updateTaskStatus,
    assignTask
} from '../controllers/cleaning.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getCleaningTasks);
router.post('/', authenticateToken, createCleaningTask);
router.put('/:id/status', authenticateToken, updateTaskStatus);
router.put('/:id/assign', authenticateToken, assignTask);

export default router;
