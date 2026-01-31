import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all settings
export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.setting.findMany();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error });
    }
};

// Update setting
export const updateSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        let stringValue = value;
        if (typeof value !== 'string') {
            stringValue = JSON.stringify(value);
        }

        const setting = await prisma.setting.upsert({
            where: { key: String(key) },
            update: { value: stringValue },
            create: { key: String(key), value: stringValue }
        });

        res.json(setting);
    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({ message: 'Error updating setting', error });
    }
};
