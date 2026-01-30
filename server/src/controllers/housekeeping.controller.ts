import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get housekeeping status for all rooms
export const getHousekeepingStatus = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany({
            select: {
                id: true,
                number: true,
                name: true,
                status: true,
                floor: true,
                type: true
            },
            orderBy: [
                { floor: 'asc' },
                { number: 'asc' }
            ]
        });

        // Group by floor
        const groupedByFloor: { [key: number]: typeof rooms } = {};
        rooms.forEach((room: { floor: number }) => {
            if (!groupedByFloor[room.floor]) {
                groupedByFloor[room.floor] = [];
            }
            groupedByFloor[room.floor].push(room as any);
        });

        // Count by status
        const counts = {
            available: rooms.filter((r: { status: string }) => r.status === 'available').length,
            occupied: rooms.filter((r: { status: string }) => r.status === 'occupied').length,
            cleaning: rooms.filter((r: { status: string }) => r.status === 'cleaning').length,
            maintenance: rooms.filter((r: { status: string }) => r.status === 'maintenance').length,
            reserved: rooms.filter((r: { status: string }) => r.status === 'reserved').length
        };

        res.json({
            rooms,
            groupedByFloor,
            counts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching housekeeping status' });
    }
};

// Update room status (for housekeeping)
export const updateRoomStatus = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['available', 'occupied', 'cleaning', 'maintenance', 'reserved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const room = await prisma.room.update({
            where: { id },
            data: { status }
        });

        res.json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating room status' });
    }
};

// Mark room as cleaned (cleaning -> available)
export const markRoomCleaned = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const room = await prisma.room.update({
            where: { id },
            data: { status: 'available' }
        });

        res.json({ message: 'Room marked as cleaned', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking room as cleaned' });
    }
};

// Mark room for maintenance
export const markRoomMaintenance = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Check if room is occupied
        const room = await prisma.room.findUnique({
            where: { id },
            include: { bookings: { where: { status: { in: ['confirmed', 'checked_in'] } } } }
        });

        if (room?.bookings && room.bookings.length > 0) {
            return res.status(400).json({ message: 'Cannot set maintenance for occupied room' });
        }

        const updatedRoom = await prisma.room.update({
            where: { id },
            data: { status: 'maintenance' }
        });

        res.json({ message: 'Room marked for maintenance', room: updatedRoom, reason });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error marking room for maintenance' });
    }
};

// Complete maintenance
export const completeMaintenance = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const room = await prisma.room.update({
            where: { id },
            data: { status: 'available' }
        });

        res.json({ message: 'Maintenance completed', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error completing maintenance' });
    }
};
