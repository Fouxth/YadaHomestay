import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get today's check-ins and check-outs
export const getDailyCheckInOuts = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Bookings checking in today
        const checkIns = await prisma.booking.findMany({
            where: {
                checkInDate: {
                    gte: today,
                    lt: tomorrow
                },
                status: { in: ['confirmed', 'pending'] } // Not yet checked in
            },
            include: {
                room: true,
                customer: true
            }
        });

        // Bookings checking out today
        const checkOuts = await prisma.booking.findMany({
            where: {
                checkOutDate: {
                    gte: today,
                    lt: tomorrow
                },
                status: 'checked-in' // Must be checked in to check out
            },
            include: {
                room: true,
                customer: true
            }
        });

        res.json({ checkIns, checkOuts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily check-ins/outs', error });
    }
};

// Perform Check-in
export const performCheckIn = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;
        const staffId = (req.user as any)?.userId as string;


        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { room: true }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Create Check-in record
        const checkIn = await prisma.checkInOut.create({
            data: {
                bookingId,
                roomId: booking.roomId,
                customerId: booking.customerId,
                type: 'check-in',
                staffId,
                notes: 'Regular check-in'
            }
        });

        // Update booking status
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'checked-in' }
        });

        // Update room status
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'occupied' }
        });

        res.json(checkIn);
    } catch (error) {
        res.status(500).json({ message: 'Error performing check-in', error });
    }
};

// Perform Check-out
export const performCheckOut = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;
        const staffId = (req.user as any)?.userId as string;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { room: true }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Create Check-out record
        const checkOut = await prisma.checkInOut.create({
            data: {
                bookingId,
                roomId: booking.roomId,
                customerId: booking.customerId,
                type: 'check-out',
                staffId,
                notes: 'Regular check-out'
            }
        });

        // Update booking status
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'checked-out' }
        });

        // Update room status to 'cleaning' instead of 'available'
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'cleaning' }
        });

        // Auto-create cleaning task
        await prisma.cleaningTask.create({
            data: {
                roomId: booking.roomId,
                type: 'checkout',
                status: 'pending',
                priority: 'high',
                notes: `Check-out cleaning for booking ${booking.bookingCode}`
            }
        });

        res.json(checkOut);
    } catch (error) {
        res.status(500).json({ message: 'Error performing check-out', error });
    }
};
