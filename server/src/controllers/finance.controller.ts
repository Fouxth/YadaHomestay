import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get transactions
export const getTransactions = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, type } = req.query;
        const where: any = {};

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string)
            };
        }
        if (type) where.type = type;

        const transactions = await prisma.transaction.findMany({
            where,
            include: { staff: { select: { name: true } } },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

// Add transaction (Income/Expense)
export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { type, category, amount, paymentMethod, description, date } = req.body;
        const staffId = (req.user as any)?.userId as string;

        const count = await prisma.transaction.count();
        const code = `TXN-${String(count + 1).padStart(5, '0')}`;

        const transaction = await prisma.transaction.create({
            data: {
                code,
                type,
                category,
                amount: Number(amount),
                paymentMethod,
                description,
                date: date ? new Date(date) : new Date(),
                staffId
            }
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
};

// Get Summary
export const getFinanceSummary = async (req: Request, res: Response) => {
    try {
        // Simple summary: Total Income, Total Expense
        const summary = await prisma.transaction.groupBy({
            by: ['type'],
            _sum: { amount: true }
        });

        const income = summary.find(s => s.type === 'income')?._sum.amount || 0;
        const expense = summary.find(s => s.type === 'expense')?._sum.amount || 0;

        res.json({ income, expense, net: income - expense });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching finance summary', error });
    }
};
