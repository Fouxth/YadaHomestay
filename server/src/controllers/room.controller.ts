import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Helper to parse amenities safely
const parseAmenities = (val: string | null): string[] => {
    if (!val || val === '""' || val === "''") return [];
    try {
        // Try parsing as JSON first
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        // If string but not array, split by comma
        // Check if it's a single string being treated as JSON
        if (typeof parsed === 'string') return [parsed];
        return val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } catch {
        // Fallback to comma separated
        return val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
};

// Helper to stringify amenities
const stringifyAmenities = (val: any): string => {
    if (Array.isArray(val)) return JSON.stringify(val);
    if (typeof val === 'string') return val; // Already string
    return '[]';
};

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { number: 'asc' }
        });

        const formattedRooms = rooms.map(room => ({
            ...room,
            amenities: parseAmenities(room.amenities)
        }));

        res.json(formattedRooms);
    } catch (error) {
        console.error('Error in getRooms:', error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
};

export const getRoom = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const room = await prisma.room.findUnique({ where: { id } });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const formattedRoom = {
            ...room,
            amenities: parseAmenities(room.amenities)
        };

        res.json(formattedRoom);
    } catch (error) {
        console.error('Error in getRoom:', error);
        res.status(500).json({ message: 'Error fetching room' });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { amenities, id, createdAt, updatedAt, ...rest } = req.body;

        // Ensure numeric fields are correct types
        const dataToSave: any = { ...rest };
        if (dataToSave.capacity) dataToSave.capacity = parseInt(dataToSave.capacity);
        if (dataToSave.floor) dataToSave.floor = parseInt(dataToSave.floor);
        if (dataToSave.pricePerNight) dataToSave.pricePerNight = parseFloat(dataToSave.pricePerNight);

        const room = await prisma.room.create({
            data: {
                ...dataToSave,
                amenities: stringifyAmenities(amenities)
            }
        });

        res.status(201).json({
            ...room,
            amenities: parseAmenities(room.amenities)
        });
    } catch (error: any) {
        console.error('Error in createRoom:', error);
        res.status(500).json({
            message: 'Error creating room',
            error: error.message
        });
    }
};

export const updateRoom = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { amenities, id: bodyId, createdAt, updatedAt, ...rest } = req.body;

        // Sanitize and format data
        const formattedData: any = { ...rest };

        // Ensure numeric types
        if (formattedData.capacity) formattedData.capacity = parseInt(formattedData.capacity);
        if (formattedData.floor) formattedData.floor = parseInt(formattedData.floor);
        if (formattedData.pricePerNight) formattedData.pricePerNight = parseFloat(formattedData.pricePerNight);

        // Handle amenities serialization
        if (amenities !== undefined) {
            formattedData.amenities = stringifyAmenities(amenities);
        }

        console.log(`Updating room ${id} with data:`, formattedData);

        const room = await prisma.room.update({
            where: { id },
            data: formattedData
        });

        res.json({
            ...room,
            amenities: parseAmenities(room.amenities)
        });
    } catch (error: any) {
        console.error('Error in updateRoom:', error);
        res.status(500).json({
            message: 'Error updating room',
            error: error.message
        });
    }
};

export const deleteRoom = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.room.delete({ where: { id } });
        res.json({ message: 'Room deleted' });
    } catch (error) {
        console.error('Error in deleteRoom:', error);
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

        const formattedRooms = availableRooms.map(room => ({
            ...room,
            amenities: parseAmenities(room.amenities)
        }));

        res.json(formattedRooms);
    } catch (error) {
        console.error('Error in getAvailableRooms:', error);
        res.status(500).json({ message: 'Error fetching available rooms' });
    }
};
