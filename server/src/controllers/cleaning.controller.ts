import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all cleaning tasks
export const getCleaningTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.cleaningTask.findMany({
            include: {
                room: true,
                assignedTo: {
                    select: { id: true, name: true, username: true } // Only return necessary user info
                }
            },
            orderBy: [
                { status: 'asc' }, // pending first
                { priority: 'desc' }, // urgent first
                { createdAt: 'desc' }
            ]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cleaning tasks', error });
    }
};

// Create a cleaning task (manual)
export const createCleaningTask = async (req: Request, res: Response) => {
    try {
        const { roomId, type, priority, notes, assignedToId } = req.body;

        const task = await prisma.cleaningTask.create({
            data: {
                roomId,
                type,
                priority: priority || 'normal',
                notes,
                assignedToId,
                status: 'pending'
            }
        });

        // Update room status
        await prisma.room.update({
            where: { id: roomId },
            data: { status: 'cleaning' }
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating cleaning task', error });
    }
};

// Update task status (e.g. start, complete)
export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { status } = req.body; // pending, in-progress, completed

        const data: any = { status };
        if (status === 'in-progress') {
            data.startedAt = new Date();
        } else if (status === 'completed') {
            data.completedAt = new Date();
        }

        const task = await prisma.cleaningTask.update({
            where: { id },
            data,
            include: { room: true }
        });

        // If completed, update room status to available
        if (status === 'completed') {
            await prisma.room.update({
                where: { id: task.roomId },
                data: { status: 'available' }
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status', error });
    }
};

// Assign staff to task
export const assignTask = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { assignedToId } = req.body;

        const task = await prisma.cleaningTask.update({
            where: { id },
            data: { assignedToId },
            include: { assignedTo: true }
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning task', error });
    }
};
