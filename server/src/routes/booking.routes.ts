import { Router } from 'express';
import { getBookings, getBooking, createBooking, updateBooking, deleteBooking, checkIn, checkOut } from '../controllers/booking.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getBookings);
router.get('/:id', getBooking);

// Protected routes
router.post('/', authenticateToken, createBooking);
router.put('/:id', authenticateToken, updateBooking);
router.delete('/:id', authenticateToken, requireAdmin, deleteBooking);

// Check-in/Check-out routes
router.post('/:id/checkin', authenticateToken, checkIn);
router.post('/:id/checkout', authenticateToken, checkOut);

export default router;
