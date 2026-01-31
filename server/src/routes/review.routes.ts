import express from 'express';
import { submitReview, getPublicReviews, getAllReviews, updateReview, deleteReview } from '../controllers/review.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/submit', submitReview);         // Submit review by booking code
router.get('/public', getPublicReviews);      // Get approved reviews for homepage

// Admin routes
router.get('/', authenticateToken, getAllReviews);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

export default router;
