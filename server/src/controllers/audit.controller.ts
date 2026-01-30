import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Audit log action types
type ActionType =
    | 'CREATE_BOOKING'
    | 'UPDATE_BOOKING'
    | 'DELETE_BOOKING'
    | 'CHECK_IN'
    | 'CHECK_OUT'
    | 'CREATE_ROOM'
    | 'UPDATE_ROOM'
    | 'DELETE_ROOM'
    | 'CREATE_ORDER'
    | 'UPDATE_ORDER'
    | 'CREATE_USER'
    | 'UPDATE_USER'
    | 'DELETE_USER'
    | 'LOGIN'
    | 'LOGOUT'
    | 'ROOM_STATUS_CHANGE';

// Create audit log entry
export const createAuditLog = async (
    userId: string,
    action: ActionType,
    entityType: string,
    entityId: string,
    details: any,
    ipAddress?: string
) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entityType,
                entityId,
                details: JSON.stringify(details),
                ipAddress
            }
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};

// Get audit logs with filters
export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            action,
            entityType,
            startDate,
            endDate,
            page = '1',
            limit = '50'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entityType) where.entityType = entityType;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate as string);
            if (endDate) where.createdAt.lte = new Date(endDate as string);
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            }),
            prisma.auditLog.count({ where })
        ]);

        res.json({
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
};

// Get audit log statistics
export const getAuditStats = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const where: any = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate as string);
            if (endDate) where.createdAt.lte = new Date(endDate as string);
        }

        const [actionCounts, userActivity] = await Promise.all([
            // Count by action type
            prisma.auditLog.groupBy({
                by: ['action'],
                where,
                _count: { action: true }
            }),
            // Top active users
            prisma.auditLog.groupBy({
                by: ['userId'],
                where,
                _count: { userId: true },
                orderBy: { _count: { userId: 'desc' } },
                take: 10
            })
        ]);

        // Get user details for top users
        const userIds = userActivity.map((u: { userId: string }) => u.userId);
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, username: true }
        });

        const userActivityWithDetails = userActivity.map((ua: { userId: string; _count: { userId: number } }) => ({
            ...ua,
            user: users.find((u: { id: string }) => u.id === ua.userId)
        }));

        res.json({
            actionCounts,
            userActivity: userActivityWithDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching audit stats' });
    }
};
