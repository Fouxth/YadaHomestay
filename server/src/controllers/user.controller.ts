import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                phone: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const getUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                phone: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, name, role, phone, email } = req.body;

        // Check if username exists
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role: role || 'staff',
                phone,
                email
            },
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                phone: true,
                email: true,
                isActive: true,
                createdAt: true
            }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { username, password, name, role, phone, email, isActive } = req.body;

        const data: any = { username, name, role, phone, email, isActive };

        // Only hash and update password if provided
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                phone: true,
                email: true,
                isActive: true,
                updatedAt: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (req.user?.userId === id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { name, phone, email, password } = req.body;
        const data: any = { name, phone, email };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                phone: true,
                email: true,
                updatedAt: true
            }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};
