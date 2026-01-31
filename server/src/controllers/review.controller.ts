import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Submit a review (Public - by booking code)
export const submitReview = async (req: Request, res: Response) => {
    try {
        const { bookingCode, rating, comment, cleanlinessRating, serviceRating, locationRating, valueRating } = req.body;

        if (!bookingCode || !rating) {
            return res.status(400).json({ message: 'กรุณาระบุรหัสการจองและคะแนน' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'คะแนนต้องอยู่ระหว่าง 1-5' });
        }

        // Find the booking
        const booking = await prisma.booking.findUnique({
            where: { bookingCode },
            include: { review: true }
        });

        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบการจองนี้' });
        }

        // Check if booking is checked-out
        if (booking.status !== 'checked-out' && booking.status !== 'confirmed') {
            return res.status(400).json({ message: 'สามารถรีวิวได้เฉพาะการจองที่เช็คเอาท์แล้วเท่านั้น' });
        }

        // Check if already reviewed
        if (booking.review) {
            return res.status(400).json({ message: 'การจองนี้ได้รับการรีวิวแล้ว' });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                bookingId: booking.id,
                rating,
                comment,
                cleanlinessRating,
                serviceRating,
                locationRating,
                valueRating
            }
        });

        res.status(201).json({
            message: 'ขอบคุณสำหรับรีวิว!',
            review
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งรีวิว' });
    }
};

// Get all approved reviews (Public - for homepage display)
export const getPublicReviews = async (req: Request, res: Response) => {
    try {
        const { limit = '6', highlighted } = req.query;

        const where: any = { isApproved: true };
        if (highlighted === 'true') {
            where.isHighlighted = true;
        }

        const reviews = await prisma.review.findMany({
            where,
            take: parseInt(limit as string),
            orderBy: [
                { isHighlighted: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                booking: {
                    select: {
                        guestName: true,
                        checkOutDate: true,
                        room: { select: { name: true, type: true } }
                    }
                }
            }
        });

        // Calculate average rating
        const stats = await prisma.review.aggregate({
            where: { isApproved: true },
            _avg: {
                rating: true,
                cleanlinessRating: true,
                serviceRating: true,
                locationRating: true,
                valueRating: true
            },
            _count: true
        });

        res.json({
            reviews,
            stats: {
                totalReviews: stats._count,
                averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
                cleanliness: stats._avg.cleanlinessRating ? Math.round(stats._avg.cleanlinessRating * 10) / 10 : 0,
                service: stats._avg.serviceRating ? Math.round(stats._avg.serviceRating * 10) / 10 : 0,
                location: stats._avg.locationRating ? Math.round(stats._avg.locationRating * 10) / 10 : 0,
                value: stats._avg.valueRating ? Math.round(stats._avg.valueRating * 10) / 10 : 0
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Get all reviews (Admin)
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                booking: {
                    select: {
                        bookingCode: true,
                        guestName: true,
                        guestPhone: true,
                        room: { select: { name: true } }
                    }
                }
            }
        });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Update review (Admin - approve/reject/highlight)
export const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = String(req.params.id);
        const { isApproved, isHighlighted } = req.body;

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: {
                isApproved,
                isHighlighted
            }
        });

        res.json({ message: 'อัปเดตสำเร็จ', review });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Error updating review' });
    }
};

// Delete review (Admin)
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = String(req.params.id);

        await prisma.review.delete({ where: { id: reviewId } });

        res.json({ message: 'ลบรีวิวสำเร็จ' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Error deleting review' });
    }
};
