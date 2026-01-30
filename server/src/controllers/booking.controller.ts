import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { room: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

export const getBooking = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { room: true }
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking' });
    }
};

// Check if room is available for given dates
const isRoomAvailable = async (roomId: string, checkInDate: Date, checkOutDate: Date, excludeBookingId?: string) => {
    const conflictingBookings = await prisma.booking.findMany({
        where: {
            roomId,
            status: {
                not: 'cancelled'
            },
            ...(excludeBookingId && { id: { not: excludeBookingId } }),
            OR: [
                {
                    checkInDate: {
                        gte: checkInDate,
                        lt: checkOutDate
                    }
                },
                {
                    checkOutDate: {
                        gt: checkInDate,
                        lte: checkOutDate
                    }
                },
                {
                    AND: [
                        { checkInDate: { lte: checkInDate } },
                        { checkOutDate: { gte: checkOutDate } }
                    ]
                }
            ]
        }
    });
    return conflictingBookings.length === 0;
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { roomNumber, roomName, ...data } = req.body;

        // Check room availability
        const checkInDate = new Date(data.checkInDate);
        const checkOutDate = new Date(data.checkOutDate);

        const isAvailable = await isRoomAvailable(data.roomId, checkInDate, checkOutDate);
        if (!isAvailable) {
            return res.status(400).json({ message: 'Room is not available for the selected dates' });
        }

        // Generate booking code if not provided
        if (!data.bookingCode) {
            data.bookingCode = `BK-${Date.now().toString().slice(-6)}`;
        }

        // Calculate nights
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

        const booking = await prisma.booking.create({
            data: {
                ...data,
                checkInDate,
                checkOutDate,
                nights
            },
            include: { room: true }
        });

        // Update room status to occupied
        await prisma.room.update({
            where: { id: data.roomId },
            data: { status: 'occupied' }
        });

        res.status(201).json(booking);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

export const updateBooking = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.checkInDate) data.checkInDate = new Date(data.checkInDate);
        if (data.checkOutDate) data.checkOutDate = new Date(data.checkOutDate);

        // If dates changed, check availability
        if (data.checkInDate && data.checkOutDate && data.roomId) {
            const isAvailable = await isRoomAvailable(data.roomId, data.checkInDate, data.checkOutDate, id);
            if (!isAvailable) {
                return res.status(400).json({ message: 'Room is not available for the selected dates' });
            }

            // Recalculate nights
            data.nights = Math.ceil(
                (data.checkOutDate.getTime() - data.checkInDate.getTime()) / (1000 * 60 * 60 * 24)
            );
        }

        const booking = await prisma.booking.update({
            where: { id },
            data,
            include: { room: true }
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking' });
    }
};

export const deleteBooking = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        // Get booking to find room
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Delete booking
        await prisma.booking.delete({ where: { id } });

        // Update room status back to available
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'available' }
        });

        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking' });
    }
};

export const checkIn = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: 'checked_in' },
            include: { room: true }
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error checking in' });
    }
};

export const checkOut = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update booking status
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: 'checked_out' },
            include: { room: true }
        });

        // Update room status to cleaning (needs housekeeping)
        await prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'cleaning' }
        });

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error checking out' });
    }
};
