import { Router } from 'express';
import { getSettings, updateSetting } from '../controllers/setting.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getSettings);
router.put('/:key', authenticateToken, updateSetting);

export default router;
