import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms' });
    }
};

export const getRoom = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const room = await prisma.room.findUnique({ where: { id } });
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching room' });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const room = await prisma.room.create({ data });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room' });
    }
};

export const updateRoom = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const room = await prisma.room.update({
            where: { id },
            data
        });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error updating room' });
    }
};

export const deleteRoom = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.room.delete({ where: { id } });
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room' });
    }
};

// Get available rooms for a date range
export const getAvailableRooms = async (req: Request, res: Response) => {
    try {
        const { checkIn, checkOut, guests } = req.query;

        if (!checkIn || !checkOut) {
            return res.status(400).json({ message: 'Check-in and check-out dates are required' });
        }

        const checkInDate = new Date(checkIn as string);
        const checkOutDate = new Date(checkOut as string);
        const guestCount = guests ? parseInt(guests as string) : 1;

        // Find rooms that are not booked in the given date range
        const availableRooms = await prisma.room.findMany({
            where: {
                capacity: {
                    gte: guestCount
                },
                status: {
                    not: 'maintenance'
                },
                bookings: {
                    none: {
                        AND: [
                            {
                                status: {
                                    not: 'cancelled'
                                }
                            },
                            {
                                OR: [
                                    {
                                        // Booking starts during our range
                                        checkInDate: {
                                            gte: checkInDate,
                                            lt: checkOutDate
                                        }
                                    },
                                    {
                                        // Booking ends during our range
                                        checkOutDate: {
                                            gt: checkInDate,
                                            lte: checkOutDate
                                        }
                                    },
                                    {
                                        // Booking covers our entire range
                                        AND: [
                                            { checkInDate: { lte: checkInDate } },
                                            { checkOutDate: { gte: checkOutDate } }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        });

        res.json(availableRooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching available rooms' });
    }
};
