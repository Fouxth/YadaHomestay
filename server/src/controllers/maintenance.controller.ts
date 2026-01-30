import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all maintenance tasks
export const getMaintenanceTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.maintenanceTask.findMany({
            include: {
                room: true,
                assignedTo: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance tasks', error });
    }
};

// Create task
export const createMaintenanceTask = async (req: Request, res: Response) => {
    try {
        const { roomId, location, title, description, category, priority, images } = req.body;

        const task = await prisma.maintenanceTask.create({
            data: {
                roomId,
                location,
                title,
                description,
                category,
                priority: priority || 'normal',
                images: images ? JSON.stringify(images) : undefined,
                status: 'pending'
            }
        });

        // If linked to room, update room status
        if (roomId) {
            await prisma.room.update({
                where: { id: roomId },
                data: { status: 'maintenance' }
            });
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating maintenance task', error });
    }
};

// Update task
export const updateMaintenanceTask = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { status, actualCost, notes } = req.body;

        const data: any = {};
        if (status) data.status = status;
        if (actualCost) data.actualCost = actualCost;
        if (status === 'in-progress') data.startedAt = new Date();
        if (status === 'completed') data.completedAt = new Date();

        const task = await prisma.maintenanceTask.update({
            where: { id },
            data,
            include: { room: true }
        });

        // If completed and linked to room, set room as available (or user should do it manually? Let's auto-set for now)
        if (status === 'completed' && task.roomId) {
            await prisma.room.update({
                where: { id: task.roomId },
                data: { status: 'available' }
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating maintenance task', error });
    }
};

// Assign staff
export const assignMaintenanceTask = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { assignedToId } = req.body;

        const task = await prisma.maintenanceTask.update({
            where: { id },
            data: { assignedToId },
            include: { assignedTo: true }
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning maintenance task', error });
    }
};
