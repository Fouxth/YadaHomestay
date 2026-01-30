import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get counts
        const [
            totalRooms,
            availableRooms,
            occupiedRooms,
            totalBookings,
            todayCheckIns,
            todayCheckOuts,
            pendingBookings,
            totalRevenue
        ] = await Promise.all([
            prisma.room.count(),
            prisma.room.count({ where: { status: 'available' } }),
            prisma.room.count({ where: { status: 'occupied' } }),
            prisma.booking.count(),
            prisma.booking.count({
                where: {
                    checkInDate: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: { not: 'cancelled' }
                }
            }),
            prisma.booking.count({
                where: {
                    checkOutDate: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: { not: 'cancelled' }
                }
            }),
            prisma.booking.count({ where: { status: 'pending' } }),
            prisma.booking.aggregate({
                where: { paymentStatus: 'paid' },
                _sum: { paidAmount: true }
            })
        ]);

        // Get recent bookings
        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { room: true },
            where: { status: { not: 'cancelled' } }
        });

        // Get low stock products
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: { lt: 10 },
                isActive: true
            },
            take: 5
        });

        res.json({
            counts: {
                totalRooms,
                availableRooms,
                occupiedRooms,
                totalBookings,
                todayCheckIns,
                todayCheckOuts,
                pendingBookings
            },
            revenue: totalRevenue._sum.paidAmount || 0,
            recentBookings,
            lowStockProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

export const getRevenueReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(1));
        const end = endDate ? new Date(endDate as string) : new Date();
        end.setHours(23, 59, 59, 999);

        // Get bookings revenue
        const bookingsRevenue = await prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                },
                paymentStatus: 'paid'
            },
            select: {
                paidAmount: true,
                createdAt: true
            }
        });

        // Get orders revenue
        const ordersRevenue = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                },
                status: 'completed'
            },
            select: {
                total: true,
                createdAt: true
            }
        });

        // Calculate daily revenue
        const dailyRevenue: { [key: string]: { bookings: number; orders: number; total: number } } = {};

        bookingsRevenue.forEach((booking: { paidAmount: number; createdAt: Date }) => {
            const date = booking.createdAt.toISOString().split('T')[0];
            if (!dailyRevenue[date]) {
                dailyRevenue[date] = { bookings: 0, orders: 0, total: 0 };
            }
            dailyRevenue[date].bookings += booking.paidAmount;
            dailyRevenue[date].total += booking.paidAmount;
        });

        ordersRevenue.forEach((order: { total: number; createdAt: Date }) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!dailyRevenue[date]) {
                dailyRevenue[date] = { bookings: 0, orders: 0, total: 0 };
            }
            dailyRevenue[date].orders += order.total;
            dailyRevenue[date].total += order.total;
        });

        const totalBookingsRevenue = bookingsRevenue.reduce((sum: number, b: { paidAmount: number }) => sum + b.paidAmount, 0);
        const totalOrdersRevenue = ordersRevenue.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

        res.json({
            period: { start: start.toISOString(), end: end.toISOString() },
            summary: {
                totalBookingsRevenue,
                totalOrdersRevenue,
                grandTotal: totalBookingsRevenue + totalOrdersRevenue
            },
            dailyRevenue: Object.entries(dailyRevenue)
                .map(([date, amounts]) => ({ date, ...amounts }))
                .sort((a, b) => a.date.localeCompare(b.date))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching revenue report' });
    }
};

export const getOccupancyReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date();
        const end = endDate ? new Date(endDate as string) : new Date();
        end.setDate(end.getDate() + 30);

        const totalRooms = await prisma.room.count();

        // Get all bookings in date range
        const bookings = await prisma.booking.findMany({
            where: {
                AND: [
                    { checkInDate: { lte: end } },
                    { checkOutDate: { gte: start } },
                    { status: { not: 'cancelled' } }
                ]
            }
        });

        // Calculate occupancy for each day
        const occupancy: { [key: string]: { occupied: number; available: number; rate: number } } = {};

        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];

            const occupiedRooms = bookings.filter((booking: { checkInDate: Date; checkOutDate: Date }) =>
                booking.checkInDate <= currentDate &&
                booking.checkOutDate > currentDate
            ).length;

            occupancy[dateStr] = {
                occupied: occupiedRooms,
                available: totalRooms - occupiedRooms,
                rate: Math.round((occupiedRooms / totalRooms) * 100)
            };

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate average occupancy rate
        const rates = Object.values(occupancy).map(o => o.rate);
        const averageRate = rates.reduce((sum, r) => sum + r, 0) / rates.length;

        res.json({
            period: { start: start.toISOString(), end: end.toISOString() },
            totalRooms,
            averageOccupancyRate: Math.round(averageRate),
            dailyOccupancy: Object.entries(occupancy)
                .map(([date, data]) => ({ date, ...data }))
                .sort((a, b) => a.date.localeCompare(b.date))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching occupancy report' });
    }
};
