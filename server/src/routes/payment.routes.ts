import express from 'express';
import { upload, uploadSlip, getAllSlips, getSlipsByBookingCode, verifySlip, getPaymentStats } from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes (no auth required)
router.post('/upload', upload.single('slip'), uploadSlip);
router.get('/booking/:bookingCode', getSlipsByBookingCode);

// Admin routes (auth required)
router.get('/', authenticateToken, getAllSlips);
router.get('/stats', authenticateToken, getPaymentStats);
router.put('/:id/verify', authenticateToken, verifySlip);

export default router;
