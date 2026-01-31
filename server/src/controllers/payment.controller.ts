import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/slips');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'slip-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Upload slip for a booking (Public - no auth required)
export const uploadSlip = async (req: Request, res: Response) => {
    try {
        const { bookingCode, amount } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'กรุณาอัปโหลดรูปสลิป' });
        }

        if (!bookingCode) {
            return res.status(400).json({ message: 'กรุณาระบุรหัสการจอง' });
        }

        // Find the booking
        const booking = await prisma.booking.findUnique({
            where: { bookingCode }
        });

        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบการจองนี้' });
        }

        // Create payment slip record
        const slip = await prisma.paymentSlip.create({
            data: {
                bookingId: booking.id,
                imageUrl: `/uploads/slips/${file.filename}`,
                amount: amount ? parseFloat(amount) : null
            }
        });

        res.status(201).json({
            message: 'อัปโหลดสลิปสำเร็จ',
            slip
        });
    } catch (error: any) {
        console.error('Error uploading slip:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดสลิป', error: error.message });
    }
};

// Get all slips (Admin)
export const getAllSlips = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        const slips = await prisma.paymentSlip.findMany({
            where,
            include: {
                booking: {
                    select: {
                        bookingCode: true,
                        guestName: true,
                        guestPhone: true,
                        totalAmount: true,
                        paidAmount: true,
                        paymentStatus: true,
                        room: {
                            select: { name: true, number: true }
                        }
                    }
                },
                verifiedBy: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(slips);
    } catch (error) {
        console.error('Error fetching slips:', error);
        res.status(500).json({ message: 'Error fetching slips' });
    }
};

// Get slips for a specific booking (Public - by booking code)
export const getSlipsByBookingCode = async (req: Request, res: Response) => {
    try {
        const bookingCode = String(req.params.bookingCode);

        const booking = await prisma.booking.findUnique({
            where: { bookingCode },
            include: {
                paymentSlips: {
                    orderBy: { createdAt: 'desc' }
                },
                room: {
                    select: { name: true, number: true }
                }
            }
        });

        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบการจองนี้' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking slips:', error);
        res.status(500).json({ message: 'Error fetching booking' });
    }
};

// Verify payment slip (Admin)
export const verifySlip = async (req: Request, res: Response) => {
    try {
        const { status, notes } = req.body;
        const userId = (req as any).user?.id;

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // First, get the slip to find the bookingId
        const slipId = String(req.params.id);
        const existingSlip = await prisma.paymentSlip.findUnique({
            where: { id: slipId }
        });

        if (!existingSlip) {
            return res.status(404).json({ message: 'ไม่พบสลิปนี้' });
        }

        // Update the slip status
        const slip = await prisma.paymentSlip.update({
            where: { id: slipId },
            data: {
                status,
                notes,
                verifiedAt: new Date(),
                verifiedById: userId
            }
        });

        // Get the booking details
        const booking = await prisma.booking.findUnique({
            where: { id: existingSlip.bookingId }
        });

        if (!booking) {
            return res.status(404).json({ message: 'ไม่พบการจอง' });
        }

        // If verified, update booking payment status
        if (status === 'verified') {
            const totalVerified = await prisma.paymentSlip.aggregate({
                where: {
                    bookingId: existingSlip.bookingId,
                    status: 'verified'
                },
                _sum: { amount: true }
            });

            const paidAmount = totalVerified._sum.amount || booking.totalAmount;

            await prisma.booking.update({
                where: { id: existingSlip.bookingId },
                data: {
                    paidAmount,
                    paymentStatus: paidAmount >= booking.totalAmount ? 'paid' : 'pending',
                    status: booking.status === 'pending' ? 'confirmed' : booking.status
                }
            });
        }

        res.json({ message: 'อัปเดตสถานะสำเร็จ', slip });
    } catch (error) {
        console.error('Error verifying slip:', error);
        res.status(500).json({ message: 'Error verifying slip' });
    }
};

// Get payment summary stats (Admin)
export const getPaymentStats = async (req: Request, res: Response) => {
    try {
        const [pending, verified, rejected, total] = await Promise.all([
            prisma.paymentSlip.count({ where: { status: 'pending' } }),
            prisma.paymentSlip.count({ where: { status: 'verified' } }),
            prisma.paymentSlip.count({ where: { status: 'rejected' } }),
            prisma.paymentSlip.count()
        ]);

        res.json({ pending, verified, rejected, total });
    } catch (error) {
        console.error('Error fetching payment stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
